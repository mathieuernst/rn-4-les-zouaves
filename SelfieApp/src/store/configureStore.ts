import ApiClient from '@data/api/client';
import ApiConsumer from '@data/api/consumer';
import {
  __DEV_LOGS_ENABLE_API__,
  __DEV_LOGS_ENABLE_REDUX__,
  __DEV_LOGS_ENABLE_SAGA__,
  __DEV__
} from '@data/consts';
import createSagaMiddleware from '@redux-saga/core';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger, ReduxLoggerOptions } from 'redux-logger';
import createSagaMonitor, { SagaMonitorConfig } from 'saga-monitor';

import { rootReducers, rootSagas } from './reducers';

const REDUX_LOGGER_OPTIONS: ReduxLoggerOptions = {
  collapsed: true,
  timestamp: true,
  duration: false
};

const SAGA_MONITOR_CONFIG: SagaMonitorConfig = {
  level: 'log',
  verbose: true,
  rootSagaStart: true,
  effectTrigger: true,
  effectResolve: false,
  effectReject: true,
  effectCancel: true,
  actionDispatch: false
};

export function configureStore(): { store: Store } {
  const [apiLogs, sagaLogs, reduxLogs] = [
    __DEV_LOGS_ENABLE_API__,
    __DEV_LOGS_ENABLE_SAGA__,
    __DEV_LOGS_ENABLE_REDUX__
  ];
  const sagaMiddleware = createSagaMiddleware(
    sagaLogs
      ? {
          sagaMonitor: createSagaMonitor(SAGA_MONITOR_CONFIG)
        }
      : {}
  );
  const client = new ApiClient();
  apiLogs ? client.enableLog() : client.disableLog();
  const api = new ApiConsumer(client);
  const middlewares = __DEV__
    ? composeWithDevTools(
        applyMiddleware(
          ...[
            sagaMiddleware,
            ...(reduxLogs ? [createLogger(REDUX_LOGGER_OPTIONS)] : [])
          ]
        )
      )
    : compose(applyMiddleware(...[sagaMiddleware]));
  const store = createStore(rootReducers, middlewares) as any;
  // tslint:disable-next-line:typedef
  store.subscribe(() => {
    const state = store.getState();
    if (state.api.jwtToken !== (api.getToken() || null)) {
      api.setToken(state.api.jwtToken || undefined);
    }
  });
  sagaMiddleware.run(rootSagas, api);
  return { store };
}
