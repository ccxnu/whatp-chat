import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { EnvService } from '@/infra/env/env.service';
import { MessagesService } from '@/infra/wpp-connect-sdk';
import { I18nTranslations } from '@/src/infra/generated/i18n.generated';

import { HandlerFilter } from '../filter/handler-filter';

@Injectable()
export class CommandsHandler implements IUpdateHandler
{
  private readonly logger = new Logger(CommandsHandler.name);

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filter: HandlerFilter,
    private readonly config: EnvService,
  )
  {}

  match({ response }: any)
  {
    return this.filter.check(response).isCommand('commands');
  }

  async handle({ response }: any)
  {
    this.logger.log('.commands command received');

    const commandsDescriptions = this.i18n.t('commands.commands-info', {
      args: { prefix: this.config.get('COMMAND_PREFIX') },
    });

    const header = this.i18n.t('commands.header');

    const textParts = [header];

    Object.entries(commandsDescriptions).forEach(([command, info]) => 
{
      textParts.push(
        this.i18n.t('commands.command-item', {
          args: {
            prefix: this.config.get('COMMAND_PREFIX'),
            name: command,
            description: info.description,
          },
        }),
      );
    });

    textParts.push(
      this.i18n.t('commands.footer', {
        args: {
          prefix: this.config.get('COMMAND_PREFIX'),
        },
      }),
    );

    const text = textParts.join('\n');

    MessagesService.postApiSendMessage(response.session, {
      phone: response.chatId,
      isGroup: response.isGroupMsg,
      message: text,
    });
  }
}
