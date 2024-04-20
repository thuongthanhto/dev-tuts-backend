import { Module } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../../core/strategies';
import { IsExist } from '../../core/utils/validators/is-exists.validator';
import { IsNotExist } from '../../core/utils/validators/is-not-exists.validator';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthFacebookService } from './services/auth-facebook.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    AuthGoogleService,
    AuthFacebookService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AccessTokenStrategy, RefreshTokenStrategy, PassportModule],
})
export class AuthModule {}
