import { toNumber } from 'lodash';

export function tryParseNumber(n: string) {
  const result = toNumber(n);

  if (isNaN(result)) {
    return null;
  }

  return result;
}
