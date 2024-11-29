import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { HashComparer } from '@/application/cryptography/hash-compare';
import { HashGenerator } from '@/application/cryptography/hash-generator';


@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer
{
	private HASH_SALT_LENGTH = 10;

	hash(plain: string): Promise<string>
  {
		return hash(plain, this.HASH_SALT_LENGTH);
	}

	compare(plain: string, hash: string): Promise<boolean>
  {
		return compare(plain, hash);
	}

  async otpCode(): Promise<string>
  {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }
}
