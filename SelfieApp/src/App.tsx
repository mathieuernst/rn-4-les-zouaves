/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { configureStore } from './store';

import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';

type Props = {};

type State = {
  isLoading: boolean;
  store: ReturnType<typeof configureStore>['store'];
};

export default class App extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    const { store } = configureStore();
    this.state = { isLoading: false, store };
  }

  public render(): React.ReactNode {
    const { store } = this.state;
    return (
      <NavigationContainer>
        <Provider store={store}>
          <Router />
        </Provider>
      </NavigationContainer>
    );
  }
}
