import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/core/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
