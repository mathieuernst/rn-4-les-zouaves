import {
  ActionsMap as ApiActionsMap,
  ActionsTypes as ApiActionsTypes,
  State as ApiState
} from './api/types';
import {
  ActionsMap as RequestsActionsMap,
  ActionsTypes as RequestsActionsTypes,
  State as RequestsState
} from './requests/types';

export type State = {
  api: ApiState;
  requests: RequestsState;
};

export const ActionsTypes = {
  api: ApiActionsTypes,
  requests: RequestsActionsTypes
};

export type ActionsMap = ApiActionsMap & RequestsActionsMap;

export type ActionsTypes = typeof ActionsTypes;

export { ApiState, ApiActionsTypes, ApiActionsMap };
export { RequestsState, RequestsActionsTypes, RequestsActionsMap };
