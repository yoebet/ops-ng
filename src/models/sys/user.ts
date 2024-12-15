import { Model } from '../model';

export class User extends Model {
  username: string;
  role?: string;
  email?: string;
}

export class LoginInfo {
  user: User;
  accessToken: string;
}

export interface JwtPayload {
  username: string;
  userId: number;
  role?: string;
}
