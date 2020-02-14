import { JwtToken } from '@custom-types/brands';
import {
  IApiClientDeleteRequest,
  IApiClientGetRequest,
  IApiClientPostRequest,
  IApiClientPutRequest,
  IApiClientRequest
} from '@data/api/client/types';
import { API_REQUEST_TIMEOUT, API_URL } from '@data/consts';
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource
} from 'axios';

export type CancelToken = {
  readonly source: CancelTokenSource;
};

// tslint:disable: no-console

// tslint:disable-next-line: typedef
const getConfigHeader = (token: undefined | JwtToken, isFormData: boolean) => ({
  headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    Accept: 'application/json'
  }
});

// tslint:disable-next-line: typedef
export const getVersionsParams = () => ({
  params: {}
});

export default class ApiClient {
  public static makeCancelToken(): CancelToken {
    return { source: Axios.CancelToken.source() };
  }

  private readonly axiosInstance: AxiosInstance;
  private _log: boolean;

  public constructor() {
    this.axiosInstance = Axios.create({ baseURL: API_URL });
    this.axiosInstance.defaults.timeout = API_REQUEST_TIMEOUT;
    this.setupInterceptors();
    this._log = false;
  }

  public enableLog(): void {
    if (!this._log) {
      console.log('[🔥] enabled ApiClient logs');
      this._log = true;
    }
  }

  public disableLog(): void {
    if (this._log) {
      console.log('[🔥] disabled ApiClient logs');
      this._log = false;
    }
  }

  public async get<RESPONSE, PARAMS extends undefined | { [key: string]: any }>(
    token: undefined | JwtToken,
    request: IApiClientGetRequest<PARAMS>,
    cancelToken?: CancelToken
  ): Promise<RESPONSE> {
    return this.request<RESPONSE, PARAMS>(token, request, cancelToken);
  }

  public async post<
    RESPONSE,
    PARAMS extends undefined | { [key: string]: any },
    DATA extends undefined | { [key: string]: any }
  >(
    token: undefined | JwtToken,
    request: IApiClientPostRequest<PARAMS, DATA>,
    cancelToken?: CancelToken
  ): Promise<RESPONSE> {
    return this.request<RESPONSE, PARAMS, DATA>(token, request, cancelToken);
  }

  public async put<
    RESPONSE,
    PARAMS extends undefined | { [key: string]: any },
    DATA extends undefined | { [key: string]: any }
  >(
    token: undefined | JwtToken,
    request: IApiClientPutRequest<PARAMS, DATA>,
    cancelToken?: CancelToken
  ): Promise<RESPONSE> {
    return this.request<RESPONSE, PARAMS, DATA>(token, request, cancelToken);
  }

  public async delete<
    RESPONSE,
    PARAMS extends undefined | { [key: string]: any }
  >(
    token: undefined | JwtToken,
    request: IApiClientDeleteRequest<PARAMS>,
    cancelToken?: CancelToken
  ): Promise<RESPONSE> {
    return this.request<RESPONSE, PARAMS>(token, request, cancelToken);
  }

  private async request<
    RESPONSE,
    PARAMS extends undefined | { [key: string]: any },
    DATA extends undefined | FormData | { [key: string]: any } = undefined
  >(
    token: undefined | JwtToken,
    request: IApiClientRequest<PARAMS, DATA>,
    cancelToken?: CancelToken
  ): Promise<RESPONSE> {
    const isFormData = !!(request.data && request.data instanceof FormData);
    const configHeader = getConfigHeader(token, isFormData);
    const configParams: { [key: string]: any } = getVersionsParams();
    request.headers = { ...request.headers, ...configHeader.headers };
    request.params = { ...request.params, ...configParams.params };
    if (cancelToken) request.cancelToken = cancelToken.source.token;
    return new Promise<RESPONSE>((resolve, reject): void => {
      this.axiosInstance
        .request<RESPONSE>(request)
        .then(response => resolve(response.data)) // tslint:disable-line:typedef
        .catch(reject);
    });
  }

  private setupInterceptors(): void {
    const stripUrl = (
      config: AxiosRequestConfig,
      request: undefined | any
    ): string => {
      let route: string = request ? request.responseURL : '';
      if (config.baseURL) route = route.replace(config.baseURL, '/');
      const lastIndex = route.lastIndexOf('?');
      if (lastIndex >= 0) route = route.substring(0, lastIndex);
      return route;
    };
    this.axiosInstance.interceptors.request.use(
      (request: AxiosRequestConfig): AxiosRequestConfig => {
        if (this._log) {
          const method = (request.method || '').toUpperCase();
          let route = request.url || '';
          if (route.startsWith(API_URL)) {
            route = route.slice(API_URL.length - 1);
          }
          console.groupCollapsed(`[🚀] ${method} ${route}`);
          console.log('request', request);
          console.groupEnd();
        }
        return request;
      }
    );
    this.axiosInstance.interceptors.response.use(
      (resp: AxiosResponse): AxiosResponse => {
        if (this._log) {
          const method: string = (resp.config.method || '').toUpperCase();
          const route = stripUrl(resp.config, resp.request);
          const emo = resp.status >= 200 || resp.status < 300 ? '💚' : '💔';
          const status = resp.status;
          console.groupCollapsed(`[${emo}] ${status} (${method}) ${route}`);
          console.log('response', resp);
          console.groupEnd();
        }
        return resp;
      },
      async (error: AxiosError): Promise<AxiosError> => {
        if (this._log) {
          let catchError: undefined | any;
          let method: string | undefined;
          let route: string | undefined;
          let status: number | undefined;
          try {
            method = error.config.method;
            route = stripUrl(error.config, error.request);
            status = error.response ? error.response.status : undefined;
          } catch (err) {
            catchError = err;
          }
          if (!(!!catchError || !method || !route || status === undefined)) {
            console.groupCollapsed(
              `[💔] ${status} (${method.toUpperCase()}) ${route}`
            );
            console.log('response', error.response);
            console.groupEnd();
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
