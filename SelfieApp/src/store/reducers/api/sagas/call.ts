import { PromiseReturnType, StrongType } from '@custom-types/index';
import ApiClient from '@data/api/client';
import { CancelToken } from '@data/api/client/ApiClient';
import ApiConsumer from '@data/api/consumer';
import {
  ApiCallFailure,
  ApiCallProgress,
  ApiCallSuccess
} from '@store/reducers/api/types/actions-map';
import { makeApiActionType } from '@store/reducers/api/utils';
import { RootActions } from '@store/types';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line: no-submodule-imports

import { ActionsMap as AM, ActionsTypes as AT } from '../types';

function* doCallApiProgress({
  action: {
    payload: { key, args },
    meta: { requestUUID }
  }
}: {
  action: AM[AT.Call];
}): SagaIterator {
  yield rse.put(
    StrongType<ApiCallProgress<typeof key>>({
      type: makeApiActionType(key, 'progress'),
      payload: { key, args },
      meta: { requestUUID }
    })
  );
}

function* doCallApiSuccess({
  action: {
    payload: { key, args },
    meta: { requestUUID }
  },
  response
}: {
  action: AM[AT.Call];
  response: PromiseReturnType<ApiConsumer[typeof key]>;
}): SagaIterator {
  yield rse.put(
    StrongType<ApiCallSuccess<typeof key>>({
      type: makeApiActionType(key, 'success'),
      payload: {
        key,
        args,
        response
      },
      meta: { requestUUID }
    })
  );
}

function* doCallApiFailure({
  action: {
    payload: { key, args },
    meta: { requestUUID }
  },
  response
}: {
  action: AM[AT.Call];
  response: any;
}): SagaIterator {
  yield rse.put(
    StrongType<ApiCallFailure<typeof key>>({
      type: makeApiActionType(key, 'failure'),
      payload: { key, args, response },
      meta: { requestUUID }
    })
  );
}

function* callApi(api: ApiConsumer, action: AM[AT.Call]): SagaIterator {
  const {
    payload: { key, args },
    meta: { requestUUID, jwtToken }
  } = action;
  let cancelToken: CancelToken | undefined;
  try {
    yield rse.call(doCallApiProgress, { action });
    const method = (yield rse.apply(api, api[key], args)) as ReturnType<
      typeof api[typeof key]
    >;
    cancelToken = (yield rse.call(ApiClient.makeCancelToken)) as ReturnType<
      typeof ApiClient.makeCancelToken
    >;
    const { response, cancel } = (yield rse.race({
      response: rse.call(method, cancelToken, jwtToken),
      cancel: rse.take(
        (a: RootActions): any =>
          a.type === AT.Cancel && a.payload.requestUUID === requestUUID
      )
    })) as {
      response?: PromiseReturnType<typeof method>;
      cancel?: AM[AT.Cancel];
    };
    if (cancel) {
      console.warn('cancel ', cancel);
    } else {
      yield rse.call(doCallApiSuccess, { action, response: response! }); // tslint:disable-line: no-non-null-assertion
    }
  } catch (error) {
    yield rse.call(doCallApiFailure, { action, response: error });
  }
}

function* callApiSaga(api: ApiConsumer): SagaIterator {
  yield rse.takeEvery(AT.Call, callApi, api);
}

export default callApiSaga;
