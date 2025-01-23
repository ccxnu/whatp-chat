import { HttpModule as Axios } from '@nestjs/axios';
import { Module } from '@nestjs/common'

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { ReceivedMessageController } from '@/domain/events/received-message/received-message.controller';
import { HandlerFilter } from '@/domain/filter/handler-filter';
import { ChatHandler } from '@/domain/handlers/chat.handler';
import { CommandsHandler } from '@/domain/handlers/commands.handler';
import { HelpHandler } from '@/domain/handlers/help.handler';
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
  imports: [EnvModule, Axios],
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
	]
})
export class HttpModule
{}
