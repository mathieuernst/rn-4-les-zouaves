import v4 from 'uuid/v4'; // tslint:disable-line: no-submodule-imports
import v5 from 'uuid/v5'; // tslint:disable-line: no-submodule-imports

const NAMESPACE = '6cc0444b-803b-4b6c-83af-d9f984a1c9a8';

export type UUID = string;

/**
 * makeUuid - generate an unique string identifier
 * @param id - will generate the same uuid for the same id specified
 */
export function makeUuid(id?: number): UUID {
  return v5(id !== undefined ? id.toString() : v4(), NAMESPACE);
}
