import { actions as apiAction } from './api';
import { actions as requestsAction } from './requests';

const rootActions = {
  ...apiAction,
  ...requestsAction
};

export default rootActions;
