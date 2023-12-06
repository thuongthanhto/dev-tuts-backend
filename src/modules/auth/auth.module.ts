import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User } from '../database/entities';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../../core/strategies';
import { IsExist } from '../../core/utils/validators/is-exists.validator';
import { IsNotExist } from '../../core/utils/validators/is-not-exists.validator';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthFacebookService } from './services/auth-facebook.service';
import { UsersModule } from '../users/users.module';
import { ForgotModule } from '../forgot/forgot.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    ForgotModule,
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
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
  exports: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
