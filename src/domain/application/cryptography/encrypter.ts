import { IActiveUser } from "@/core/repositories/active-user-data";

export abstract class Encrypter
{
	abstract encrypt(payload: IActiveUser): Promise<string>;
}
