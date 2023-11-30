import { User } from '../database/entities';

export interface FacebookInterface {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface GoogleInterface {
  sub: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}
export interface SocialInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export type LoginResponseType = Readonly<{
  access_token: string;
  refresh_token: string;
  user: User;
}>;
