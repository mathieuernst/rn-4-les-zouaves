import { createReducer } from '@store/utils';

import { ActionsTypes as AT, State } from '../types';

const reducers = createReducer<State>(
  (state = { jwtToken: null }, action): State => {
    switch (action.type) {
      case AT.ConnectingSuccess: {
        const { jwt } = action.payload.response;

        return {
          ...state,
          jwtToken: jwt
        };
      }
      default:
        return state;
    }
  }
);

export default reducers;
