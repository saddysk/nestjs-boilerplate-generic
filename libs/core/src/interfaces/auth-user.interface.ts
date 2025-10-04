export interface IAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  status: 'active' | 'pending' | 'suspended';
  jti?: string;
}
