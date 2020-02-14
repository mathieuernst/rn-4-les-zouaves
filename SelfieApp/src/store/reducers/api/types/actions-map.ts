import { JwtToken, RequestUUID } from '@custom-types/brands';
import {
  assertType,
  isValidMappedEnum,
  PromiseReturnType
} from '@custom-types/index';
import { CancelToken } from '@data/api/client/ApiClient';
import ApiConsumer from '@data/api/consumer';
import { FormLogin } from '@data/models/login';
import { RootAction } from '@store/types';
import { ExecutorType, RequestUUIDMeta } from '@store/utils';

import { ActionsTypes as AT } from './actions-types';

export type ApiCallProgress<
  K extends ActionsMap[AT.Call]['payload']['key']
> = RootAction<
  string,
  {
    key: K;
    args: Parameters<ApiConsumer[K]>;
  },
  RequestUUIDMeta
>;

export type ApiCallSuccess<
  K extends ActionsMap[AT.Call]['payload']['key']
> = RootAction<
  string,
  {
    key: K;
    args: Parameters<ApiConsumer[K]>;
    response: PromiseReturnType<ApiConsumer[K]>;
  },
  RequestUUIDMeta
>;

export type ApiCallFailure<
  K extends ActionsMap[AT.Call]['payload']['key']
> = RootAction<
  string,
  {
    key: K;
    args: Parameters<ApiConsumer[K]>;
    response: any;
  },
  RequestUUIDMeta
>;

export type ActionsMap = {
  [AT.Call]: RootAction<
    AT.Call,
    {
      [K in keyof ApiConsumer]: ApiConsumer[K] extends (
        ...args: any[]
      ) => (cancelToken?: CancelToken, jwtToken?: JwtToken) => Promise<any>
        ? {
            key: K;
            args: Parameters<ApiConsumer[K]>;
          }
        : never;
    }[keyof ApiConsumer],
    RequestUUIDMeta
  >;
  [AT.Cancel]: RootAction<AT.Cancel, { requestUUID: RequestUUID }>;
  [AT.Connect]: RootAction<
    AT.Connect,
    { data: FormLogin },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.Connecting]: RootAction<
    AT.Connecting,
    { data: FormLogin },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.ConnectingSuccess]: RootAction<
    AT.ConnectingSuccess,
    { data: FormLogin; response: { jwt: JwtToken } },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.ConnectingFailure]: RootAction<
    AT.ConnectingFailure,
    { data: FormLogin; response: any },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;

  [AT.CheckEmail]: RootAction<
    AT.CheckEmail,
    { data: { email: string } },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.CheckingEmail]: RootAction<
    AT.CheckingEmail,
    { data: { email: string } },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.CheckingEmailSuccess]: RootAction<
    AT.CheckingEmailSuccess,
    { data: { email: string } },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
  [AT.CheckingEmailFailure]: RootAction<
    AT.CheckingEmailFailure,
    { data: { email: string } },
    { requestUUID: RequestUUID; executor?: ExecutorType }
  >;
};

assertType<
  isValidMappedEnum<ActionsMap, AT>,
  'should implements all actions types'
>(true);
