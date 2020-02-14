import { JwtToken } from '@custom-types/brands';
import { PromiseReturnType, StrongType } from '@custom-types/index';
import ApiConsumer from '@data/api/consumer';
import { makeUuid } from '@helper/uuid';
import { rootActions } from '@store/reducers';
import {
  ApiCallFailure,
  ApiCallSuccess
} from '@store/reducers/api/types/actions-map';
import {
  isApiActionFailure,
  isApiActionSuccess
} from '@store/reducers/api/utils';
import { ApiActionsTypes } from '@store/reducers/types';
import {
  RootActions,
  RootActionsMap as AM,
  RootActionType
} from '@store/types';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line:no-submodule-imports

export enum DoCallApiResponseType {
  Success = 'Success',
  Failure = 'Failure'
}

export type DoCallApiResponse<
  ApiConsumerKey extends AM[ApiActionsTypes.Call]['payload']['key']
> =
  | {
      type: DoCallApiResponseType.Success;
      response: PromiseReturnType<ApiConsumer[ApiConsumerKey]>;
    }
  | {
      type: DoCallApiResponseType.Failure;
      response: any;
    };

export function* doCallApi<
  ApiConsumerKey extends AM[ApiActionsTypes.Call]['payload']['key']
>({
  apiConsumerKey,
  apiArgs,
  onProgress,
  onSuccess,
  onFailure,
  jwtToken
}: {
  jwtToken?: JwtToken;
  apiConsumerKey: ApiConsumerKey;
  apiArgs: Extract<
    AM[ApiActionsTypes.Call]['payload'],
    { key: ApiConsumerKey }
  >['args'];
  onProgress?(): SagaIterator;
  onSuccess?(
    response: PromiseReturnType<ApiConsumer[ApiConsumerKey]>
  ): SagaIterator;
  onFailure?(error: any): SagaIterator;
}): SagaIterator {
  const requestUUID = makeUuid();
  try {
    if (onProgress) yield rse.call(onProgress);
    yield rse.put(
      rootActions[ApiActionsTypes.Call](
        // tslint:disable-next-line: no-object-literal-type-assertion
        {
          key: apiConsumerKey,
          args: apiArgs
        } as AM[ApiActionsTypes.Call]['payload'],
        { requestUUID, jwtToken }
      )
    );
    const apiAction = (yield rse.take(
      (a: RootActions): any =>
        (isApiActionSuccess(a, apiConsumerKey) ||
          isApiActionFailure(a, apiConsumerKey)) &&
        (a as ApiCallSuccess<typeof apiConsumerKey>).meta.requestUUID ===
          requestUUID
    )) as
      | ApiCallSuccess<typeof apiConsumerKey>
      | ApiCallFailure<typeof apiConsumerKey>;
    if (isApiActionSuccess(apiAction, apiConsumerKey)) {
      if (onSuccess) yield rse.call(onSuccess, apiAction.payload.response);
      return StrongType<DoCallApiResponse<ApiConsumerKey>>({
        type: DoCallApiResponseType.Success,
        response: apiAction.payload.response
      });
    } else {
      throw apiAction.payload.response;
    }
  } catch (error) {
    if (onFailure) yield rse.call(onFailure, error);
    return StrongType<DoCallApiResponse<ApiConsumerKey>>({
      type: DoCallApiResponseType.Failure,
      response: error
    });
  }
}

function* doCallAndWaitApi<
  ApiConsumerKey extends AM[ApiActionsTypes.Call]['payload']['key']
>({
  apiConsumerKey,
  makeApiArgs,
  makeProgressAction,
  makeSuccessAction,
  makeFailureAction,
  jwtToken
}: {
  jwtToken?: JwtToken;
  apiConsumerKey: ApiConsumerKey;
  makeApiArgs(): Extract<
    AM[ApiActionsTypes.Call]['payload'],
    { key: ApiConsumerKey }
  >['args'];
  makeProgressAction(): RootActionType;
  makeSuccessAction(
    response: PromiseReturnType<ApiConsumer[ApiConsumerKey]>
  ): RootActionType | RootActionType[];
  makeFailureAction(response: any): RootActionType;
}): SagaIterator {
  function* onProgress(): SagaIterator {
    yield rse.put(makeProgressAction());
  }
  function* onSuccess(
    response: PromiseReturnType<ApiConsumer[ApiConsumerKey]>
  ): SagaIterator {
    const action = makeSuccessAction(response);
    if (Array.isArray(action)) {
      // tslint:disable-next-line:prefer-for-of increment-decrement
      for (let i = 0; i < action.length; i++) {
        yield rse.put(action[i]);
        if (action[i].meta.executor) {
          yield rse.call(action[i].meta.executor.resolve);
        }
      }
    } else {
      yield rse.put(action);
      if (action.meta.executor) yield rse.call(action.meta.executor.resolve);
    }
  }
  // tslint:disable-next-line:no-shadowed-variable
  function* onFailure(response: any): SagaIterator {
    const action = makeFailureAction(response);
    if (Array.isArray(action)) {
      // tslint:disable-next-line:prefer-for-of increment-decrement
      for (let i = 0; i < action.length; i++) {
        yield rse.put(action[i]);
        if (action[i].meta.executor) {
          yield rse.call(action[i].meta.executor.reject);
        }
      }
    } else {
      yield rse.put(action);
      if (action.meta.executor) yield rse.call(action.meta.executor.reject);
    }
  }
  yield rse.call(doCallApi, {
    apiConsumerKey,
    apiArgs: makeApiArgs(),
    onProgress,
    onSuccess,
    onFailure,
    jwtToken
  });
}

export { doCallAndWaitApi };
