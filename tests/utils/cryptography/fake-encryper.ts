import { Encrypter } from "@/application/cryptography/encrypter";
import { IActiveUser } from "@/core/repositories/active-user-data";

export class FakeEncrypter implements Encrypter
{
  async encrypt(payload: IActiveUser): Promise<string>
  {
		return JSON.stringify(payload);
  }

}
