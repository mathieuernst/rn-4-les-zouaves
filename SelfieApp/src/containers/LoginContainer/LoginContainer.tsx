import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginComponent from './LoginComponent';

type OwnProps = {};
type DispatchProps = {};
type StateProps = {};

type Props = OwnProps & DispatchProps & StateProps;
type State = {};

class LoginContainer extends Component<Props, State> {
  public render(): React.ReactNode {
    return <LoginComponent />;
  }
}

export default connect(undefined, undefined)(LoginContainer);
