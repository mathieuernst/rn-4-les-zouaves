import { RequestUUID } from '@custom-types/brands';
import { SerializableWithUndefined, StrongType } from '@custom-types/index';
import { Flow, IFlowData } from '@store/reducers/requests/types/state';
import { ActionsTypes as ReducersAT } from '@store/reducers/types';
import { RootActionsMap as AM, RootReducer } from '@store/types';
import { createReducer, RequestUUIDMeta } from '@store/utils';
import reduceReducers from 'reduce-reducers';

import { State } from '../types';

function makeFlowReducer<
  StartAC extends {
    type: string;
    meta: RequestUUIDMeta;
    payload?: SerializableWithUndefined;
  },
  SuccessAC extends {
    type: string;
    meta: RequestUUIDMeta;
    payload?: SerializableWithUndefined;
  },
  FailureAC extends {
    type: string;
    meta: RequestUUIDMeta;
    payload?: SerializableWithUndefined;
  }
>({
  type,
  startingAT,
  successAT,
  failureAT,
  getRequestUUID
}: {
  type: Flow['type'];
  startingAT: StartAC['type'];
  successAT: SuccessAC['type'];
  failureAT: FailureAC['type'];
  getRequestUUID(action: StartAC | SuccessAC | FailureAC): RequestUUID;
}): RootReducer<State, StartAC | SuccessAC | FailureAC> {
  return createReducer<State, StartAC | SuccessAC | FailureAC>(
    (state = {}, anyAction): State => {
      switch (anyAction.type) {
        case startingAT: {
          const action = anyAction as StartAC;
          const requestUUID = getRequestUUID(action);
          // const before = requestUUID in state ? state[requestUUID] : undefined;
          return {
            ...state,
            [requestUUID]: StrongType<IFlowData<any>>({
              requestUUID,
              type,
              payload: action.payload,
              meta: action.meta,
              startAt: Date.now(),
              hasError: false,
              endAt: null,
              isSending: true
            })
          };
        }
        case successAT: {
          const action = anyAction as SuccessAC;
          const requestUUID = getRequestUUID(action);
          const before = requestUUID in state ? state[requestUUID] : undefined;
          return {
            ...state,
            [requestUUID]: StrongType<IFlowData<any>>({
              requestUUID,
              type,
              payload: action.payload,
              meta: action.meta,
              startAt: before ? before.startAt : Date.now(),
              hasError: false,
              endAt: Date.now(),
              isSending: false
            })
          };
        }
        case failureAT: {
          const action = anyAction as FailureAC;
          const requestUUID = getRequestUUID(action);
          const before = requestUUID in state ? state[requestUUID] : undefined;
          return {
            ...state,
            [requestUUID]: StrongType<IFlowData<any>>({
              requestUUID,
              type,
              payload: action.payload,
              meta: action.meta,
              startAt: before ? before.startAt : Date.now(),
              hasError: true,
              endAt: Date.now(),
              isSending: false
            })
          };
        }
        default:
          return state;
      }
    }
  );
}

/* tslint:disable:typedef */

const flowReducers: {
  [K in Flow['type']]: RootReducer<State, any>;
} = {
  [ReducersAT.api.Connect]: makeFlowReducer<
    AM[ReducersAT['api']['Connecting']],
    AM[ReducersAT['api']['ConnectingSuccess']],
    AM[ReducersAT['api']['ConnectingFailure']]
  >({
    type: ReducersAT.api.Connect,
    startingAT: ReducersAT.api.Connecting,
    successAT: ReducersAT.api.ConnectingSuccess,
    failureAT: ReducersAT.api.ConnectingFailure,
    getRequestUUID: a => a.meta.requestUUID
  })
};

/* tslint:enable */

const reducer = reduceReducers<State>(
  // @ts-ignore
  createReducer<State>(
    (state = {}, action): State => {
      switch (action.type) {
        default:
          return state;
      }
    }
  ),
  ...Object.values(flowReducers)
);

export default reducer;
