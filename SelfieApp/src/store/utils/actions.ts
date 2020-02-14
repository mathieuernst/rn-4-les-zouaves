import {
  RootActionCreator,
  RootActionCreatorsMapObject,
  RootActionsMapType,
  RootActionType
} from '@store/types';

export function makeActionCreator<A extends RootActionType>(
  type: A['type']
): RootActionCreator<A> {
  // tslint:disable-next-line: typedef
  return (params => ({ ...params, type })) as RootActionCreator<A>;
}

export function makeActionCreators<ActionsMap extends RootActionsMapType>(
  keys: string[]
): { [K in keyof ActionsMap]: RootActionCreator<ActionsMap[K]> } {
  const actions: Partial<RootActionCreatorsMapObject<ActionsMap>> = {};
  keys.forEach(k => (actions[k as keyof ActionsMap] = makeActionCreator(k)));
  return actions as RootActionCreatorsMapObject<ActionsMap>;
}
