import { JwtToken, RequestUUID } from '@custom-types/brands';

export type RequestUUIDMeta = {
  requestUUID: RequestUUID;
  jwtToken?: JwtToken;
};
