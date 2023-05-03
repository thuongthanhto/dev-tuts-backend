import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  }) // at least one uppercase, one lowercase, one number or special character
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  lastName: string;

  @IsEmail()
  email: string;
}
