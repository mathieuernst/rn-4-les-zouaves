import { ApiCallSuccess } from '@store/reducers/api/types/actions-map';
import {
  ApiActionsMap as AM,
  ApiActionsTypes as AT
} from '@store/reducers/types';
import { RootActionType } from '@store/types';

export function makeApiActionType(
  key: AM[AT.Call]['payload']['key'],
  type: 'progress' | 'success' | 'failure'
): string {
  switch (type) {
    case 'progress':
      return `@@api/${key}`;
    case 'success':
      return `@@api/${key}/SUCCESS`;
    case 'failure':
      return `@@api/${key}/FAILURE`;
    default: {
      const invalid: never = type;
      console.error('invalid enum', invalid);
      return `@@api/${key}/${type}`;
    }
  }
}

export function isApiActionSuccess<K extends AM[AT.Call]['payload']['key']>(
  action: RootActionType,
  key: K
): action is ApiCallSuccess<K> {
  return action.type === makeApiActionType(key, 'success');
}

export function isApiActionFailure<K extends AM[AT.Call]['payload']['key']>(
  action: RootActionType,
  key: K
): action is ApiCallSuccess<K> {
  return action.type === makeApiActionType(key, 'failure');
}
