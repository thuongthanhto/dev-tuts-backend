import { Injectable } from '@nestjs/common';

import { RoleEnum } from '../../roles/roles.enum';
import { StatusEnum } from '../../statuses/statuses.enum';
import { UsersService } from '../../users/users.service';
import { AuthRegisterDto } from '../dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(dto: AuthRegisterDto): Promise<void> {
    await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });

    // const hash = await this.jwtService.signAsync(
    //   {
    //     confirmEmailUserId: user.id,
    //   },
    //   {
    //     secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
    //       infer: true,
    //     }),
    //     expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
    //       infer: true,
    //     }),
    //   },
    // );

    // await this.mailService.userSignUp({
    //   to: dto.email,
    //   data: {
    //     hash,
    //   },
    // });
  }
}
