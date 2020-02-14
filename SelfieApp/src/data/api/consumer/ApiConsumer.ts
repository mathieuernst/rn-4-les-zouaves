import { JwtToken } from '@custom-types/brands';
import { CancelToken } from '@data/api/client/ApiClient';
import { ApiRequest } from '@data/api/client/types';
import { FormLogin } from '@data/models/login';

import ApiClient from '../client';

type Login = {
  post: {
    response: { success: { jwt: JwtToken }; failure: {} };
    params: {};
    data: FormLogin;
  };
};

type CheckEmail = {
  post: {
    response: { success: null; failure: {} };
    params: {};
    data: { email: string };
  };
};

/* tslint:disable:max-file-line-count */

/* tslint:disable:typedef */

export default class ApiConsumer {
  private readonly apiClient: ApiClient;
  private token: JwtToken | undefined;

  public constructor(apiClient: ApiClient, token?: JwtToken) {
    this.apiClient = apiClient;
    this.token = token;
  }

  public getToken(): JwtToken | undefined {
    return this.token;
  }

  public setToken(token: JwtToken | undefined): this {
    this.token = token;
    return this;
  }

  public login = (data: FormLogin) => (
    cancelToken?: CancelToken,
    jwtToken?: JwtToken
  ) =>
    this.apiClient.post<
      Login['post']['response']['success'],
      Login['post']['params'],
      Login['post']['data']
    >(
      jwtToken || this.token,
      ApiRequest.Post({
        url: '/login',
        data
      }),
      cancelToken
    );

  public checkEmail = (data: CheckEmail['post']['data']) => (
    cancelToken?: CancelToken,
    jwtToken?: JwtToken
  ) =>
    this.apiClient.post<
      CheckEmail['post']['response']['success'],
      CheckEmail['post']['params'],
      CheckEmail['post']['data']
    >(
      jwtToken || this.token,
      ApiRequest.Post({
        url: '/check_email',
        data
      }),
      cancelToken
    );
}

/* tslint:enable:typedef */
