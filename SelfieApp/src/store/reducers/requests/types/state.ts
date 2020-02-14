import { RequestUUID } from '@custom-types/brands';
import { SerializableWithUndefined } from '@custom-types/index';
import { RootActionsMap as AM, RootActionsTypes as AT } from '@store/types';
import { RequestUUIDMeta } from '@store/utils';

export type FlowInfo = {
  type: 'loading' | 'success' | 'failure';
  title?: string;
  description?: string;
};

export type IFlowData<
  A extends {
    type: string;
    meta: RequestUUIDMeta;
    payload?: SerializableWithUndefined;
  }
> = {
  requestUUID: RequestUUID;
  type: A['type'];
  payload: A['payload'] | null;
  meta: RequestUUIDMeta;
  startAt: number;
  hasError: boolean;
  isSending: boolean;
  endAt: number | null;
};

export type Flow = IFlowData<AM[AT['api']['Connect']]>;

export type State = {
  readonly [K in RequestUUID]: Flow;
};
