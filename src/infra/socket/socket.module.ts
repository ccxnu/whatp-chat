import { Module } from '@nestjs/common';

import { EnvModule } from '../env/env.module';
import { SocketIoClientStrategy } from './socket-io-client.strategy';
import { SocketIoClientProvider } from './socket-io-client-provider';

@Module({
  imports: [EnvModule],
  providers:
  [
    SocketIoClientProvider,
    SocketIoClientStrategy,
  ],
  exports:
  [
    SocketIoClientProvider
  ],
})
export class SocketIoClientModule
{}
