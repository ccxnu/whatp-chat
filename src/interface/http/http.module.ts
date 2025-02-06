import { Module } from '@nestjs/common'

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { ReceivedMessageController } from '@/domain/events/received-message/received-message.controller';
import { HandlerFilter } from '@/domain/filter/handler-filter';
import { ChatHandler } from '@/domain/handlers/chat.handler';
import { CommandsHandler } from '@/domain/handlers/commands.handler';
import { HelpHandler } from '@/domain/handlers/help.handler';
import { HttpService } from '@/infra/Common/Http/HttpService';
import { IHttpService } from '@/infra/Common/Http/IHttpService';
import { EnvModule } from '@/infra/env/env.module';

const updateHandlers =
[
  HelpHandler,
  CommandsHandler,
  ChatHandler,
  //StickerHandler,
  //InfoHandler,
];

@Module({
  imports: [EnvModule],
	controllers:
  [
    ReceivedMessageController,
	],
  providers:
  [
    HandlerFilter,

    ...updateHandlers,
    {
      provide: 'ReceivedMessageHandlers',
      useFactory: (...handlers: IUpdateHandler[]) => handlers,
      inject: updateHandlers,
    },
    {
        provide: IHttpService,
        useClass: HttpService,
    },
	]
})
export class HttpModule
{}
