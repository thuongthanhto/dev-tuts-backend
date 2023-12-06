import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
// import { Role } from '../../database/entities/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  // IsOptional,
  // MinLength,
  Validate,
} from 'class-validator';
// import { Status } from 'src/statuses/entities/status.entity';
// import { FileEntity } from 'src/files/entities/file.entity';
// import { IsExist } from 'src/utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '../../../core/utils/transformers/lower-case.transformer';
import { IsNotExist } from '../../../core/utils/validators/is-not-exists.validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  // @ApiProperty()
  // @MinLength(6)
  // password?: string;

  // provider?: string;

  // socialId?: string | null;

  // @ApiProperty({ example: 'John' })
  // @IsNotEmpty()
  // firstName: string | null;

  // @ApiProperty({ example: 'Doe' })
  // @IsNotEmpty()
  // lastName: string | null;

  // @ApiProperty({ type: () => FileEntity })
  // @IsOptional()
  // @Validate(IsExist, ['FileEntity', 'id'], {
  //   message: 'imageNotExists',
  // })
  // photo?: FileEntity | null;

  // @ApiProperty({ type: Role })
  // @Validate(IsExist, ['Role', 'id'], {
  //   message: 'roleNotExists',
  // })
  // role?: Role | null;

  // @ApiProperty({ type: Status })
  // @Validate(IsExist, ['Status', 'id'], {
  //   message: 'statusNotExists',
  // })
  // status?: Status;

  hash?: string | null;
}
