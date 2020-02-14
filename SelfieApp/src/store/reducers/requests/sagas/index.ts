import { SagaIterator } from 'redux-saga';
import * as rse from 'redux-saga/effects'; // tslint:disable-line: no-submodule-imports

function* sagas(): SagaIterator {
  yield rse.all([]);
}
export default sagas;
