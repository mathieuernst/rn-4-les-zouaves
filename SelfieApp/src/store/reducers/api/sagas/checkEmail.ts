import { rootActions } from '@store/reducers';
import {
  ApiActionsMap as AM,
  ApiActionsTypes as AT
} from '@store/reducers/types';
import { doCallAndWaitApi } from '@store/utils';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line:no-submodule-imports

function* checkEmailApi(checkEmailAction: AM[AT.CheckEmail]): SagaIterator {
  const {
    payload: { data }
  } = checkEmailAction;
  /* tslint:disable:typedef */
  yield rse.call(doCallAndWaitApi, {
    apiConsumerKey: 'checkEmail',
    makeProgressAction: () => rootActions[AT.CheckingEmail](checkEmailAction),
    makeApiArgs: () => [data],
    makeSuccessAction: _response =>
      rootActions[AT.CheckingEmailSuccess](checkEmailAction),
    makeFailureAction: _response =>
      rootActions[AT.CheckingEmailFailure](checkEmailAction)
  });
  /* tslint:enable */
}

function* checkEmailApiSaga(): SagaIterator {
  yield rse.takeLatest(AT.CheckEmail, checkEmailApi);
}

export default checkEmailApiSaga;
