import { Constructor } from '../types';

/**
 * Create dto object if entity is not null otherwise return undefined
 * @param dtoClass Dto class
 * @param value dto class constructor aguments
 * @returns Dto object
 */
export function tryNew<T, Arguments extends unknown[] = undefined[]>(
  dtoClass: Constructor<T, Arguments>,
  value: Arguments
): T {
  if (value == null || value.filter((v) => !!v).length === 0) {
    return;
  }

  return new dtoClass(...value);
}
