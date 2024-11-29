import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Encrypter } from '@/application/cryptography/encrypter';
import { IActiveUser } from '@/core/repositories/active-user-data';
import { EnvService } from '@/infra/env/env.service';


@Injectable()
export class JwtEncrypter implements Encrypter
{
	constructor(
    private jwtService: JwtService,
    private readonly config: EnvService,
  )
  {}

  encrypt(payload: IActiveUser): Promise<string>
  {
    const expiresIn = this.config.get('JWT_ACCESS_TOKEN_TIME');

		return this.jwtService.signAsync(payload, { expiresIn });
	}
}
