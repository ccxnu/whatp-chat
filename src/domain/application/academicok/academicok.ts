import { User } from "@/domain/entities/user";

export type UserIsts = Pick<User, 'fullName' | 'email' | 'role'>;

export abstract class AcademicokRepository
{
	abstract fetchUserInfo(cedula: string): Promise<UserIsts | null>
}
