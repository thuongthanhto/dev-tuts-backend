import { User } from '../database/entities';

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
