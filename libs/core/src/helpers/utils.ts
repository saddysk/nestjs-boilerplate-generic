import * as bcrypt from 'bcrypt';
import type { Optional } from '../types';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHashSync(password: string, saltRound: number | string = 10): string {
  return bcrypt.hashSync(password, saltRound);
}

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string, saltRound: number | string = 10): Promise<string> {
  return bcrypt.hash(password, saltRound);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(password: Optional<string>, hash: Optional<string>): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

/**
 * Sleep for ms
 * @param ms number
 * @returns
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
