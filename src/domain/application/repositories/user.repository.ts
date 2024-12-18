import { PaginationData } from '@/core/repositories/pagination-data';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QueryDataLimitParams } from '@/core/repositories/query-data-limit';
import { User } from '@/domain/entities/user';
import { UserRoles } from '@/domain/enums/user-roles';
import { UserDetails } from '@/domain/value-objects/user-details';

export type FindManyByFiltersParams = PaginationParams & {
  role?: UserRoles;
}

export abstract class UserRepository
{
	abstract findById(id: string): Promise<User | null>
	abstract findByIdOnDeleted(id: string): Promise<User | null>
	abstract findByIdWithDetails(id: string): Promise<UserDetails | null>
	abstract findByEmail(email: string): Promise<User | null>
	abstract findByUnique(unique: string): Promise<User | null>
	abstract findByCedula(cedula: string): Promise<User | null>
	abstract findManyByFilters(props: FindManyByFiltersParams): Promise<PaginationData<UserDetails[]>>
	abstract findManyBySearchQueries(params: QueryDataLimitParams): Promise<UserDetails[]>
	abstract create(person: User): Promise<void>
	abstract edit(person: User): Promise<void>
	abstract editPassword(person: User): Promise<void>
	abstract delete(person: User): Promise<void>
	abstract recover(person: User): Promise<void>
}
