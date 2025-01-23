export abstract class IUpdateHandler
{
  abstract match(data: any): boolean;
  abstract handle(data: any): void;
}
