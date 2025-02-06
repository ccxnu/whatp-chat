import { RequestService } from "../Model/RequestService";

export abstract class IHttpService
{
    abstract requestService(request: RequestService) : Promise<any>;
}
