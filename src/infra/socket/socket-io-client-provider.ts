import { Injectable, Logger } from '@nestjs/common';
import { io,Socket } from 'socket.io-client';

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class SocketIoClientProvider
{
  private socket: Socket;
  private readonly logger = new Logger(SocketIoClientProvider.name);

  constructor(private readonly env: EnvService)
  {}

  private logStartInfo(url: string)
  {
    this.logger.verbose(`Starting socket.io client with url: ${url}`);
  }

  private connect()
  {
    const WPP_URL = this.env.get('WPPCONNECT_BASE');
    this.logStartInfo(WPP_URL);

    this.socket = io(WPP_URL);
    return this.socket;
  }

  getSocket = () =>
  {
    if (!this.socket)
    {
      return this.connect();
    }
    return this.socket;
  }
}
