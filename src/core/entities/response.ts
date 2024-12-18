import { PaginationData } from "../repositories/pagination-data";

export interface ResponseForm<T>
{
  code: 'COD_OK';
  result: T;
  info: string;
  status: true;
}

export type Try<T> = ResponseForm<T>;

export interface PaginationForm<T> {
  code: 'COD_OK';
  result: PaginationData<T>;
  info: string;
  status: true;
}

export function CreatePaginationResponse<T>(responseData: PaginationData<T>, info?: string): PaginationForm<T>
{
  return {
    code: 'COD_OK',
    info: info ?? 'El proceso se realizó con exito',
    result: {
      data: responseData.data,
      perPage: responseData.perPage,
      totalItems: responseData.totalItems,
      totalPages: responseData.totalPages,
    },
    status: true,
  };
}


export function CreateResponse<T>(result: T, info?: string): Try<T>
{
  return {
    code: 'COD_OK',
    result,
    info: info ?? 'El proceso se realizó con exito',
    status: true,
  } as const;
}
