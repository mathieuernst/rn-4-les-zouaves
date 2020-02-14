import { makeActionCreators } from '@store/utils';

import { ActionsMap as AM, ActionsTypes as AT } from '../types';

const creators = makeActionCreators<AM>(Object.values(AT));

const actions = {};

export default actions;
export { creators };
