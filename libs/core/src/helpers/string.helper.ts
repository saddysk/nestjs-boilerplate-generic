import { startsWith } from 'lodash';

export function trimStartString(str: string, start: string) {
  return !startsWith(str, start) ? str : str.replace(start, '');
}
