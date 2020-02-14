export type ExecutorType = {
  resolve(value?: any | PromiseLike<any>): void;
  reject(reason?: any): void;
};
