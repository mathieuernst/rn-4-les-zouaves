import { Without } from '@custom-types/index';
import { AxiosRequestConfig, CancelToken } from 'axios';

export enum ApiClientMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete'
}

export interface IApiClientRequest<
  PARAMS extends undefined | { [key: string]: any },
  DATA extends undefined | { [key: string]: any }
> {
  method: ApiClientMethod;
  url: string;
  headers?: AxiosRequestConfig['headers'];
  params?: PARAMS;
  data?: FormData | DATA;
  cancelToken?: CancelToken;
}

export interface IApiClientGetRequest<PARAMS> {
  method: ApiClientMethod.Get;
  url: string;
  params: PARAMS;
}

export interface IApiClientPostRequest<PARAMS, DATA> {
  method: ApiClientMethod.Post;
  url: string;
  params?: PARAMS;
  data: FormData | DATA;
}

export interface IApiClientPutRequest<PARAMS, DATA> {
  method: ApiClientMethod.Put;
  url: string;
  params?: PARAMS;
  data: FormData | DATA;
}

export interface IApiClientDeleteRequest<PARAMS> {
  method: ApiClientMethod.Delete;
  url: string;
  params: PARAMS;
}

function ApiClientGet<PARAMS>(
  data: Without<IApiClientGetRequest<PARAMS>, 'method'>
): IApiClientGetRequest<PARAMS> {
  return { method: ApiClientMethod.Get, ...data };
}

function ApiClientPost<PARAMS, DATA>(
  data: Without<IApiClientPostRequest<PARAMS, DATA>, 'method'>
): IApiClientPostRequest<PARAMS, DATA> {
  return { method: ApiClientMethod.Post, ...data };
}

function ApiClientPut<PARAMS, DATA>(
  data: Without<IApiClientPutRequest<PARAMS, DATA>, 'method'>
): IApiClientPutRequest<PARAMS, DATA> {
  return { method: ApiClientMethod.Put, ...data };
}

function ApiClientDelete<PARAMS>(
  data: Without<IApiClientDeleteRequest<PARAMS>, 'method'>
): IApiClientDeleteRequest<PARAMS> {
  return { method: ApiClientMethod.Delete, ...data };
}

export const ApiRequest = {
  Get: ApiClientGet,
  Post: ApiClientPost,
  Put: ApiClientPut,
  Delete: ApiClientDelete
};
