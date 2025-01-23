import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { EnvService } from '@/infra/env/env.service';
import { I18nTranslations } from '@/infra/generated/i18n.generated';
import { MessagesService } from '@/infra/wpp-connect-sdk';

import { HandlerFilter } from '../filter/handler-filter';

@Injectable()
export class HelpHandler implements IUpdateHandler
{
  private readonly logger = new Logger(HelpHandler.name);

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly filter: HandlerFilter,
    private readonly config: EnvService,
  ) 
{}

  match({ response }: any)
  {
    return this.filter.check(response).isCommand('help');
  }

  async handle({ response }: any)
  {
    this.logger.log('.help command received');

    const args = response.body.split(' ').slice(1);
    let text: string;

    if (args.length > 0)
    {
      const command: string = args[0];

      const commandsStrings = this.i18n.t('commands.commands-info', {
        args: { prefix: this.config.get('COMMAND_PREFIX') },
      });

      if (!Object.keys(commandsStrings).includes(command)) 
{
        text = this.i18n.t('help.error.unexistent-command', {
          args: { command },
        });

        MessagesService.postApiSendMessage(response.session, {
          phone: response.chatId,
          isGroup: response.isGroupMsg,
          message: text,
        });

        return;
      }

      const commandInfo = commandsStrings[command];

      text = [
        this.i18n.t('help.header-with-command', {
          args: { command },
        }),
        this.i18n.t('help.command-description', {
          args: { description: commandInfo.description },
        }),
        this.i18n.t('help.command-usage', {
          args: { usage: commandInfo.usage },
        }),
      ].join('\n');

      MessagesService.postApiSendMessage(response.session, {
        phone: response.chatId,
        isGroup: response.isGroupMsg,
        message: text,
      });

      return;
    }

    text = [
      this.i18n.t('help.header'),
      this.i18n.t('help.body'),
      this.i18n.t('help.footer'),
    ].join('\n');

    MessagesService.postApiSendMessage(response.session, {
      phone: response.chatId,
      isGroup: response.isGroupMsg,
      message: text,
    });
  }
}
