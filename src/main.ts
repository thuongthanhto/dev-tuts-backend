import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './modules/app/app.module';
import validationOptions from './core/utils/validation-options';
import { AllConfigType } from './core/config/config.type';
import { ResolvePromisesInterceptor } from './core/utils/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableCors();

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
