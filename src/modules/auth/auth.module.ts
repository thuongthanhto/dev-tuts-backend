import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../database/entities';
import {
  AccessTokenStrategy,
  GoogleOauthStrategy,
  RefreshTokenStrategy,
} from '../../core/strategies';
import { IsExist } from '../../core/utils/validators/is-exists.validator';
import { IsNotExist } from '../../core/utils/validators/is-not-exists.validator';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleOauthStrategy
  ],
  controllers: [AuthController],
  exports: [AccessTokenStrategy, RefreshTokenStrategy, GoogleOauthStrategy, PassportModule],
})
export class AuthModule {}
