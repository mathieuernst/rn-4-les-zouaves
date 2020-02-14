import { Brand, makeBrander } from '@custom-types/index';
import { UUID } from '@helper/uuid';

/**
 * Requests Uuid
 */
export type RequestUUID = UUID;

export type JwtToken = Brand<string, 'JwtToken'>;
export const JwtToken = makeBrander<JwtToken>();
