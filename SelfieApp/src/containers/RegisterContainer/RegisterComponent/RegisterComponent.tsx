import { Text, View } from 'react-native';
import React, { PureComponent } from 'react';

type Props = {};

export default class RegisterComponent extends PureComponent<Props> {
  public render(): React.ReactNode {
    return (
      <View>
        <Text>{'hello'}</Text>
      </View>
    );
  }
}
