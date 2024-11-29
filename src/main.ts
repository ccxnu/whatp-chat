import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { EnvService } from '@/infra/env/env.service';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './interface/common/filters/all-exception.filter';
import { LoggingInterceptor } from './interface/common/interceptors/logger.interceptor';

async function bootstrap()
{
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn'] }
  );

  // Env constants
	const envService = app.get(EnvService)
  const GLOBAL_PREFIX = envService.get('GLOBAL_PREFIX');

  app.enableCors();

  // Filter
  app.useGlobalFilters(new AllExceptionFilter());

  // Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Base routing
  app.setGlobalPrefix(GLOBAL_PREFIX);

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
