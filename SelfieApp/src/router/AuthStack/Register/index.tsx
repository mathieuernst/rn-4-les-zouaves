import { NavigationRoute, NavigationScreenProp } from 'react-navigation';
import React from 'react';
import RegisterContainer from '@containers/RegisterContainer';

export default function Register({
  navigation
}: {
  navigation: NavigationScreenProp<NavigationRoute<any>>;
}): React.ReactElement {
  console.log(navigation);
  return <RegisterContainer />;
}
