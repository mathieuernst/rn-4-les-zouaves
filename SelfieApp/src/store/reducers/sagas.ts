import ApiConsumer from '@data/api/consumer';
import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line: no-submodule-imports

import { sagas as apiSagas } from './api';
import { sagas as requestSagas } from './requests';

function* rootSagas(api: ApiConsumer): SagaIterator {
  try {
    console.log('[🔥] Saga started'); // tslint:disable-line: no-console
    yield rse.all([rse.call(apiSagas, api), rse.call(requestSagas)]);
  } finally {
    console.log('[🔥] Saga finished'); // tslint:disable-line: no-console
  }
}

export default rootSagas;
