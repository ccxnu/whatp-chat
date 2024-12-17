import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Redis } from 'ioredis'

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy
{
  constructor(config: EnvService)
  {
    super({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      db: config.get('REDIS_DB'),
    })
  }

  onModuleDestroy()
  {
    return this.disconnect()
  }
}
