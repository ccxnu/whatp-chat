import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { MessagesService } from '@/infra/wpp-connect-sdk';

import { HandlerFilter } from '../filter/handler-filter';

@Injectable()
export class ChatHandler implements IUpdateHandler
{
  private readonly logger = new Logger(ChatHandler.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly filter: HandlerFilter,
  )
  {}

  match({ response }: any)
  {
    if (this.filter.check(response).isCommand('commands')) return false;
    if (this.filter.check(response).isCommand('help')) return false;

    return response.fromMe === true ? false : true;
  }

  async handle({ response }: any)
  {
    try 
{
      const userMessage = response.body; // Obtener el mensaje del usuario
      this.logger.log(`User message: ${userMessage}`);

      // Llamar a la API con el mensaje del usuario
      const apiUrl = 'http://localhost:3000/api/rag/chat'; // Reemplaza con la URL de tu API
      const apiResponse = await firstValueFrom(
        this.httpService.post(apiUrl, { query: userMessage }),
      );

      // Extraer la respuesta del asistente
      const assistantMessage = apiResponse.data.find(
        (msg: any) => msg.role === 'assistant',
      )?.content;

      if (!assistantMessage) 
{
        throw new Error('No se encontró una respuesta del asistente.');
      }

      this.logger.log(`Assistant message: ${assistantMessage}`);

      // Enviar la respuesta al usuario
      await MessagesService.postApiSendMessage(response.session, {
        phone: response.chatId,
        isGroup: response.isGroupMsg,
        message: assistantMessage,
      });
    }
    catch (error)
    {
      this.logger.error('Error handling chat message:', error);

      // Enviar un mensaje de error al usuario
      await MessagesService.postApiSendMessage(response.session, {
        phone: response.chatId,
        isGroup: response.isGroupMsg,
        message: 'Lo siento, ocurrió un error al procesar tu mensaje.',
      });
    }
  }
}
