import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Login from './Login';
import Register from './Register';

const AuthStack = createStackNavigator();

const AuthStackRouter = (): React.ReactElement => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name={'Login'} component={Login} />
      <AuthStack.Screen name={'Register'} component={Register} />
    </AuthStack.Navigator>
  );
};

export default AuthStackRouter;
