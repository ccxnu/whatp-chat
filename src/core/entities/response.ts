export interface ResponseForm<T>
{
  code: 'COD_OK';
  result: T;
  info: string;
  status: true;
}

export type Try<T> = ResponseForm<T>;

export function CreateResponse<T>(result: T, info?: string ): Try<T> 
{
  return {
    code: 'COD_OK',
    result,
    info: info ?? 'El proceso se realizó con exito',
    status: true,
  } as const;
}
