import { RequestUUID } from '@custom-types/brands';
import { assertType, isValidMappedEnum } from '@custom-types/index';
import { FormLogin } from '@data/models/login';
import { makeUuid } from '@helper/uuid';
import { ExecutorType, makeActionCreators } from '@store/utils';

import { ActionsMap as AM, ActionsTypes as AT } from '../types';

const creators = makeActionCreators<AM>(Object.values(AT));

const fetchActions = {
  [AT.Call]: (
    payload: AM[AT.Call]['payload'],
    meta: AM[AT.Call]['meta']
  ): AM[AT.Call] => creators[AT.Call]({ payload, meta }),
  [AT.Cancel]: (requestUUID: RequestUUID): AM[AT.Cancel] =>
    creators[AT.Cancel]({ payload: { requestUUID } })
};

const connectActions = {
  [AT.Connect]: (
    requestUUID: RequestUUID,
    executor: ExecutorType,
    data: FormLogin
  ): AM[AT.Connect] =>
    creators[AT.Connect]({
      payload: { data },
      meta: { requestUUID, executor }
    }),
  [AT.Connecting]: (connectAction: AM[AT.Connect]): AM[AT.Connecting] =>
    creators[AT.Connecting]({
      ...connectAction
    }),
  [AT.ConnectingSuccess]: (
    connectAction: AM[AT.Connect],
    response: any
  ): AM[AT.ConnectingSuccess] =>
    creators[AT.ConnectingSuccess]({
      ...connectAction,
      payload: {
        ...connectAction.payload,
        data: {
          ...connectAction.payload.data
        },
        response
      }
    }),
  [AT.ConnectingFailure]: (
    connectAction: AM[AT.Connect],
    response: any
  ): AM[AT.ConnectingFailure] =>
    creators[AT.ConnectingFailure]({
      ...connectAction,
      payload: {
        ...connectAction.payload,
        data: {
          ...connectAction.payload.data
        },
        response
      }
    })
};

const checkEmailActions = {
  [AT.CheckEmail]: (executor: ExecutorType, email: string): AM[AT.CheckEmail] =>
    creators[AT.CheckEmail]({
      payload: { data: { email } },
      meta: { requestUUID: makeUuid(), executor }
    }),
  [AT.CheckingEmail]: (
    checkEmailAction: AM[AT.CheckEmail]
  ): AM[AT.CheckingEmail] =>
    creators[AT.CheckingEmail]({
      ...checkEmailAction
    }),
  [AT.CheckingEmailSuccess]: (
    checkEmailAction: AM[AT.CheckEmail]
  ): AM[AT.CheckingEmailSuccess] =>
    creators[AT.CheckingEmailSuccess]({
      ...checkEmailAction
    }),
  [AT.CheckingEmailFailure]: (
    checkEmailAction: AM[AT.CheckEmail]
  ): AM[AT.CheckingEmailFailure] =>
    creators[AT.CheckingEmailFailure]({
      ...checkEmailAction
    })
};

const actions = {
  ...fetchActions,
  ...connectActions,
  ...checkEmailActions
};

assertType<
  isValidMappedEnum<typeof actions, AT>,
  'should implements all action creators'
>(true);

export default actions;
export { creators };
