//import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
//import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { ChatMessage } from '@/domain/entities/chat-message';

export interface FindManyByFiltersParams extends PaginationParams
{
  deleted?: boolean;
}

export abstract class CourseRepository
{
  abstract create(data: ChatMessage): Promise<void>;
	abstract edit(data: ChatMessage): Promise<void>;
	abstract delete(data: ChatMessage): Promise<void>;

  abstract findById(id: string): Promise<ChatMessage | null>;
  abstract findByName(name: string): Promise<ChatMessage | null>;
  abstract findByIdOnDelete(id: string): Promise<ChatMessage | null>;
  //abstract findByIdWithDetails(id: string): Promise<CourseDetails | null>;
  //abstract findManyByQuery(params: QueryDataLimitParams): Promise<CourseDetails[]>;
  //abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<CourseDetails[]>>;
}

