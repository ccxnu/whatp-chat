import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { EnvService } from '@/infra/env/env.service';
import { SocketIoClientProvider } from '@/infra/socket/socket-io-client-provider';

import { AppModule } from './app.module';
import { SocketIoClientStrategy } from './infra/socket/socket-io-client.strategy';
import { OpenAPI } from './infra/wpp-connect-sdk';

function getLogLevels(): LogLevel[]
{
  const environment = process.env.NODE_ENV || 'development';
  const isInDevelopmentMode = environment === 'development';
  const defaultLogLevel: LogLevel[] =
  [
    'error',
    'warn',
    'log',
    'debug',
    'fatal',
  ];

  return isInDevelopmentMode ? [...defaultLogLevel, 'verbose'] : defaultLogLevel;
}

async function bootstrap()
{
  const app = await NestFactory.create(AppModule, { logger: getLogLevels() });

  // Env constants
	const config = app.get(EnvService);

  const socketIoClientProvider = app.get<SocketIoClientProvider>(SocketIoClientProvider);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new SocketIoClientStrategy(socketIoClientProvider.getSocket())
  });

  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.BASE = config.get('WPPCONNECT_BASE');
  OpenAPI.TOKEN = config.get('WPPCONNECT_TOKEN');

  await app.startAllMicroservices();

  await app.listen(0);
  console.info(`Microservice running`);
}

bootstrap();
