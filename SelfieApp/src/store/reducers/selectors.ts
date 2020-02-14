import { selectors as apiSelectors } from './api';
import { selectors as requestsSelectors } from './requests';

const rootSelectors = {
  api: apiSelectors,
  requests: requestsSelectors
};

export default rootSelectors;
