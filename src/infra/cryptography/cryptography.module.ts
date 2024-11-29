import { Module } from '@nestjs/common';

import { Encrypter } from '@/application/cryptography/encrypter';
import { HashComparer } from '@/application/cryptography/hash-compare';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import { EnvModule } from '@/infra/env/env.module';

import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  imports: [EnvModule],
	providers: [
		{
			provide: Encrypter,
			useClass: JwtEncrypter,
		},
		{
			provide: HashComparer,
			useClass: BcryptHasher,
		},
		{
			provide: HashGenerator,
			useClass: BcryptHasher,
		},
	],
	exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule
{}
