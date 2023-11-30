import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { CustomLoggerService } from './core/logger';
import { AppModule } from './modules/app/app.module';
import validationOptions from './core/utils/validation-options';

async function bootstrap() {
  const customLoggerService = new CustomLoggerService();
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(customLoggerService.createLoggerConfig),
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();

  await app.listen(4000);
}

bootstrap();
