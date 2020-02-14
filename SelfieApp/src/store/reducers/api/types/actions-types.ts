export enum ActionsTypes {
  Call = '@@api/Call',
  Cancel = '@@api/Cancel',

  Connect = '@@api/Connect',
  Connecting = '@@api/Connecting',
  ConnectingSuccess = '@@api/ConnectingSuccess',
  ConnectingFailure = '@@api/ConnectingFailure',

  CheckEmail = '@@api/CheckEmail',
  CheckingEmail = '@@api/CheckingEmail',
  CheckingEmailSuccess = '@@api/CheckingEmailSuccess',
  CheckingEmailFailure = '@@api/CheckingEmailFailure'
}
