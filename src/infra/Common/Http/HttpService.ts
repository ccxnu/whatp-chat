import { Injectable } from "@nestjs/common";
import * as axios from 'axios';

import { RequestService } from "../Model/RequestService";
import { IHttpService } from "./IHttpService";


@Injectable()
export class HttpService implements IHttpService
{

    constructor() 
{ }

    async requestService(request: RequestService): Promise<any>
    {
        const req =
        {
            method: request.method,
            url: request.service_url,
            data: request.data,
            headers: await this.addHeader(request)
        };

        const respuesta = await axios.default(req);

        return respuesta.data;
    }

    private async addHeader(request: RequestService)
    {
        const headers = {};

        if (request.header_adicionals != undefined && request.header_adicionals != null)
        {
            request.header_adicionals.forEach(e =>
            {
                if (e.value != null && e.value != '')
                {
                    headers[e.key] = e.value;
                }
            }
            );
        }

        return headers;
    }
}
