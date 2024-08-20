import { Module, Session } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { IsExist } from '../../core/utils/validators/is-exists.validator';
import { IsNotExist } from '../../core/utils/validators/is-not-exists.validator';
import { AuthGoogleService } from './services/auth-google.service';
import { AuthFacebookService } from './services/auth-facebook.service';
import { UsersModule } from '../users/users.module';
import { SessionModule } from '../session/session.module';
import {
  AnonymousStrategy,
  JwtRefreshStrategy,
  JwtStrategy,
} from './strategies';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    SessionModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    AuthGoogleService,
    AuthFacebookService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
