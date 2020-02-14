import { RequestUUID } from '@custom-types/brands';
import { RootSelector, RootState } from '@store/types';

import { State } from '../types';
import { Flow, FlowInfo } from '../types/state';

type Selectors = {
  getState: RootSelector<State>;
  flow: RootSelector<
    Flow | undefined,
    { requestUUID: RequestUUID | undefined }
  >;
  flowInfo: RootSelector<
    FlowInfo | undefined,
    { requestUUID: RequestUUID | undefined }
  >;
  isLoading: RootSelector<boolean, { requestUUID: RequestUUID | undefined }>;
};

const getStateSelector = (rootState: RootState): State => rootState.requests;

const flowSelector = (
  rootState: RootState,
  { requestUUID }: { requestUUID: RequestUUID | undefined }
): Flow | undefined => {
  const state = getStateSelector(rootState);
  if (!requestUUID) return undefined;
  return requestUUID in state ? state[requestUUID] : undefined;
};

const flowInfoSelector = (
  rootState: RootState,
  { requestUUID }: { requestUUID: RequestUUID | undefined }
): FlowInfo | undefined => {
  const flow = flowSelector(rootState, { requestUUID });
  if (!flow) return undefined;
  if (flow.endAt !== null) {
    if (flow.hasError) {
      return {
        type: 'failure'
      };
    } else {
      return {
        type: 'success'
      };
    }
  } else {
    return {
      type: 'loading'
    };
  }
};

const isLoadingSelector = (
  rootState: RootState,
  { requestUUID }: { requestUUID: RequestUUID | undefined }
): boolean => {
  const flow = flowSelector(rootState, { requestUUID });
  if (!flow) return false;
  return flow.isSending;
};

const selectors: Selectors = {
  getState: getStateSelector,
  flow: flowSelector,
  flowInfo: flowInfoSelector,
  isLoading: isLoadingSelector
};

export default selectors;
