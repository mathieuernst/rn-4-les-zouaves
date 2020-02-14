import { __DEV__ } from './dev-settings';

let DEV_API_URL = ''; // tslint:disable-line: variable-name
DEV_API_URL = 'http://local.test:3000/v1/';
// DEV_API_URL = 'https://simplelif-back-staging.herokuapp.com/api/';

const API_URL = !__DEV__ ? 'https://app.bon-ami.fr/' : DEV_API_URL;

export { API_URL };
