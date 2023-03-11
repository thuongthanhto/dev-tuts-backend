import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from 'modules/database/database.module';
import { configValidationSchema } from './config.schema';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: configValidationSchema }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
