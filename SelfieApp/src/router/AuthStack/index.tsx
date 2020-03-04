import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Login from './Login';

const AuthStack = createStackNavigator();

const AuthStackRouter = (): React.ReactElement => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name={'Home'} component={Login} />
    </AuthStack.Navigator>
  );
};

export default AuthStackRouter;
