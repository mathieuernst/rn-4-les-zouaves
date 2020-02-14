import { RootSelector, RootState } from '@store/types';

import { State } from '../types';

type Selectors = {
  getState: RootSelector<State>;
  isConnected: RootSelector<boolean>;
};

const getStateSelector = (rootState: RootState): State => rootState.api;

const isConnectedSelector = (rootState: RootState): boolean => {
  const state = getStateSelector(rootState);
  return state.jwtToken !== null;
};

const selectors: Selectors = {
  getState: getStateSelector,
  isConnected: isConnectedSelector
};

export default selectors;
