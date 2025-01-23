import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { EnvService } from '@/infra/env/env.service';

@Controller()
export class OnAckController
{
  constructor(private readonly config: EnvService)
  {}

  private readonly logger = new Logger(OnAckController.name);

  shouldLog()
  {
    return (
      this.config.get('LOG_UPDATES') &&
      this.config.get('EVENTS_TO_LOG').split(',').includes('on-ack')
    );
  }

  @MessagePattern('onack')
  handle(data: any)
  {
    if (this.shouldLog()) this.logger.verbose({ data });
  }
}
