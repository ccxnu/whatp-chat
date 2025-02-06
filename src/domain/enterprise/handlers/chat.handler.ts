import { Injectable } from '@nestjs/common';

import { IUpdateHandler } from '@/application/repositories/handle.repository';
import { IHttpService } from '@/infra/Common/Http/IHttpService';
import { RequestService } from '@/infra/Common/Model/RequestService';
import { EnvService } from '@/infra/env/env.service';
import { MessagesService } from '@/infra/wpp-connect-sdk';

import { HandlerFilter } from '../filter/handler-filter';

@Injectable()
export class ChatHandler implements IUpdateHandler
{
  private URL: string;

  constructor(
    private readonly filter: HandlerFilter,
    private readonly env: EnvService,
    private readonly httpService: IHttpService,
  )
  {
      this.URL = this.env.get('BACKEND_URL');
  }

  match({ response }: any)
  {
    if (this.filter.check(response).isCommand('commands')) return false;
    if (this.filter.check(response).isCommand('help')) return false;

    return response.fromMe === true ? false : true;
  }

  async handle({ response }: any)
  {
      const request = new RequestService();
    try
    {
      const userMessage = response.body; // Obtener el mensaje del usuario

     // Reemplaza con la URL de tu API
      request.service_url = `${this.URL}/rag/chat`;
      request.data =  { query: userMessage };

      const apiResponse = await this.httpService.requestService(request);

      // Extraer la respuesta del asistente
      const assistantMessage = apiResponse.find((msg: any) => msg.role === 'assistant')?.content;

      if (!assistantMessage)
      {
        throw new Error('No se encontró una respuesta del asistente.');
      }

      // Enviar la respuesta al usuario
      await MessagesService.postApiSendMessage(response.session, {
        phone: response.chatId,
        isGroup: response.isGroupMsg,
        message: assistantMessage,
      });
    }
    catch
    {
      await MessagesService.postApiSendMessage(response.session, {
        phone: response.chatId,
        isGroup: response.isGroupMsg,
        message: 'Lo siento, ocurrió un error al procesar tu mensaje.',
      });
    }
  }
}
