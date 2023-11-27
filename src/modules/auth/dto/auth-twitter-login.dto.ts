import { IsNotEmpty } from 'class-validator';

export class AuthTwitterLoginDto {
  @IsNotEmpty()
  accessTokenKey: string;

  @IsNotEmpty()
  accessTokenSecret: string;
}
