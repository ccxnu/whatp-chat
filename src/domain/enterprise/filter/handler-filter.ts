import { Injectable } from '@nestjs/common';

import { EnvService } from '@/infra/env/env.service';

class FiltersFulfilledWithResponse
{
  constructor
  (
    private readonly response: any,
    private readonly config: EnvService,
  )
  {}

  isCommand(command: string): boolean // Qué hago una super validación COD_HELP, COD_CHAT, COD_CHAT_HORARIO
  {
    const message = this.response.caption || this.response.body;

    if (!message) return false;

    const COMMAND_PREFIX = this.config.get('COMMAND_PREFIX');
    return message.startsWith(COMMAND_PREFIX + command);
  }
}

@Injectable()
export class HandlerFilter
{
  constructor(private readonly config: EnvService)
  {}

  check(response: any): FiltersFulfilledWithResponse
  {
    return new FiltersFulfilledWithResponse(response, this.config);
  }
}
