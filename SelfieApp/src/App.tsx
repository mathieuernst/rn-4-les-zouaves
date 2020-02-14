/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import { configureStore } from './store';

import { Provider } from 'react-redux';
import { Text, View } from 'react-native';

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
      <Provider store={store}>
        <View>
          <Text>{'test'}</Text>
        </View>
      </Provider>
    );
  }
}
