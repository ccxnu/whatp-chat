import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { IUpdateHandler } from '@/application/repositories/handle.repository';

@Controller()
export class ReceivedMessageController
{
  constructor(@Inject('ReceivedMessageHandlers') private readonly handlers: IUpdateHandler[])
  {}

  @MessagePattern('received-message')
  handle(message: any)
  {
    this.handlers.forEach((handler) =>
      {
        if (handler.match(message)) handler.handle(message);
      }
    );
  }
}
