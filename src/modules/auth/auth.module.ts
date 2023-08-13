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
  ],
  controllers: [AuthController],
  exports: [AccessTokenStrategy, RefreshTokenStrategy, PassportModule],
})
export class AuthModule {}
