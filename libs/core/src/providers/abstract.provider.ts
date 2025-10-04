import { getValue, setValue } from 'express-ctx';

export abstract class AbstractContextProvider {
  constructor(protected readonly namespace: string) {}

  private getNsKey(key: string): string {
    return `${this.namespace}.${key}`;
  }

  protected set<T = any>(key: string, value: T): void {
    return setValue(this.getNsKey(key), value);
  }

  protected get<T>(key: string): T | undefined {
    return getValue<T>(this.getNsKey(key));
  }
}
