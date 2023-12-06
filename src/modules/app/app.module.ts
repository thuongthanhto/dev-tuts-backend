import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import {
  databaseConfig,
  authConfig,
  googleConfig,
  facebookConfig,
  appConfig,
  mailConfig,
} from '../../core/config';
import { AllConfigType } from '../../core/config/config.type';
import { MailConfigService } from '../mail/mail-config.service';
import { ForgotModule } from '../forgot/forgot.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        authConfig,
        googleConfig,
        facebookConfig,
        mailConfig,
      ],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '../i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService) => {
            return [configService.get('app.headerLanguage')];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ForgotModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
