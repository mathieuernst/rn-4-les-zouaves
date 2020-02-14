import { reducer as apiReducer } from '@store/reducers/api';
import { reducer as requestsReducer } from '@store/reducers/requests';
import { combineReducers } from 'redux';

import { State } from './types';

const rootReducers = combineReducers<State>({
  api: apiReducer,
  requests: requestsReducer
});

export default rootReducers;
