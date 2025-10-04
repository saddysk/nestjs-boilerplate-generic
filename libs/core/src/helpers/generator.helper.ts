import { customAlphabet, nanoid, urlAlphabet } from 'nanoid';

import { v4 as uuidv4 } from 'uuid';

const alphanumericAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function uuid(): string {
  return uuidv4();
}

export function randomString(length: number): string {
  return nanoid(length);
}

export function randomUrlString(length: number): string {
  return customAlphabet(urlAlphabet, length)();
}

export function randomNumericString(length: number): string {
  return customAlphabet('0123456789', length)();
}

export function randomAlphaNumeric(length: number): string {
  return customAlphabet(alphanumericAlphabet, length)();
}
