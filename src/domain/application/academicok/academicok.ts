import { User } from "@/domain/entities/user";

export abstract class AcademicokRepository
{
	abstract fetchUserInfo(cedula: string): Promise<User | null>
}
