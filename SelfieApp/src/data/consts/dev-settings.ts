export const __DEV__ = process.env.NODE_ENV === 'development';

export const __DEV_LOGS_ENABLE_REDUX__ = __DEV__ && false;

export const __DEV_LOGS_ENABLE_API__ = __DEV__ && true;

export const __DEV_LOGS_ENABLE_SAGA__ = __DEV__ && false;
