import { IAuthUser } from '../interfaces/auth-user.interface';
import { AbstractContextProvider } from './abstract.provider';

export class AuthContextProvider extends AbstractContextProvider {
  private readonly USER_KEY: '__user';

  constructor(namesapce: string) {
    super(namesapce);
  }

  setUser(user: IAuthUser): void {
    this.set(this.USER_KEY, user);
  }

  user(): IAuthUser | undefined {
    return this.get<IAuthUser>(this.USER_KEY);
  }

  userId(): string | null {
    return this.user()?.id ?? null;
  }

  guest(): boolean {
    return this.get(this.USER_KEY) != null;
  }

  check(): boolean {
    return this.guest() === false;
  }
}

export const AuthUser = new AuthContextProvider('request');
