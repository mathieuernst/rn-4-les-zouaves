import ApiConsumer from '@data/api/consumer';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line: no-submodule-imports

import callApiSaga from './call';
import checkEmailApiSaga from './checkEmail';
import connectApiSaga from './connect';

function* sagas(api: ApiConsumer): SagaIterator {
  yield rse.all([
    rse.call(callApiSaga, api),
    rse.call(connectApiSaga),
    rse.call(checkEmailApiSaga)
  ]);
}
export default sagas;
