import { IsNeverOrUndefined, OmitNever, Without } from '@custom-types/index';
import { Selector } from 'react-redux';
import { Action, Reducer } from 'redux';

import {
  ActionsMap as ReducerActionsMap,
  ActionsTypes,
  State as ReducerState
} from './reducers/types';

export type RootState = ReducerState;

export type MakeRootActionType<
  T extends string,
  P = never,
  M = never
> = OmitNever<{
  type: T;
  payload: P;
  meta: M;
}>;

export type RootAction<
  TYPE extends string,
  PAYLOAD = never,
  META = never
> = MakeRootActionType<TYPE, PAYLOAD, META>;

// tslint:disable-next-line:interface-name
export interface RootActionType extends Action {
  type: string;
  payload?: any;
  meta?: any;
  error?: any;
}

export type RootActionsMapType = { [K: string]: RootActionType };

export type RootActionCreator<A extends RootActionType> = IsNeverOrUndefined<
  A['payload']
> extends true
  ? IsNeverOrUndefined<A['meta']> extends true
    ? IsNeverOrUndefined<A['error']> extends true
      ? () => A
      : (params: Without<A, 'type'>) => A
    : (params: Without<A, 'type'>) => A
  : (params: Without<A, 'type'>) => A;

export type RootActionCreatorsMapObject<AcMap extends RootActionsMapType> = {
  [K in keyof AcMap]: RootActionCreator<AcMap[K]>;
};

export type ActionsMap = ReducerActionsMap;
export type RootActionsMap = ActionsMap;

export type RootActions = RootActionsMap[keyof RootActionsMap];

export type RootReducer<
  S = RootState,
  A extends Action = RootActions
> = Reducer<S, A>;

export type RootSelector<R, Props = null> = Selector<RootState, R, Props>;
export type RootActionsTypes = typeof ActionsTypes;
