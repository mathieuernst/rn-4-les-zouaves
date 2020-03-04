import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import React from 'react';
import LoginContainer from '@containers/LoginContainer';

export default function Login({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<any>>;
}): React.ReactElement {
  console.log(navigation);
  return <LoginContainer />;
}
