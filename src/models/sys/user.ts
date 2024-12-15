import { BaseModel } from '../base-model';

export class User extends BaseModel {
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
