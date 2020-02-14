import { rootActions } from '@store/reducers';
import {
  ApiActionsMap as AM,
  ApiActionsTypes as AT
} from '@store/reducers/types';
import { doCallAndWaitApi } from '@store/utils';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line:no-submodule-imports

function* connectApi(connectAction: AM[AT.Connect]): SagaIterator {
  const {
    payload: { data }
  } = connectAction;
  /* tslint:disable:typedef */
  yield rse.call(doCallAndWaitApi, {
    apiConsumerKey: 'login',
    makeProgressAction: () => rootActions[AT.Connecting](connectAction),
    makeApiArgs: () => [data],
    makeSuccessAction: response =>
      rootActions[AT.ConnectingSuccess](connectAction, response),
    makeFailureAction: response =>
      rootActions[AT.ConnectingFailure](connectAction, response)
  });
  /* tslint:enable */
}

function* connectApiSaga(): SagaIterator {
  yield rse.takeLatest(AT.Connect, connectApi);
}

export default connectApiSaga;
