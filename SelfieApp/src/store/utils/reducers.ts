import { RootActions, RootReducer, RootState } from '@store/types';
import { Action, combineReducers, Reducer, ReducersMapObject } from 'redux';

export function createReducer<
  S = RootState,
  A extends Action = RootActions,
  R extends RootReducer<any, any> = RootReducer<S, A>
>(reducer: R): R {
  return reducer;
}

export function rootCombineReducers<S, A extends Action = RootActions>(
  r: ReducersMapObject<S, A>
): Reducer<S, A> {
  return combineReducers<S, A>(r);
}
