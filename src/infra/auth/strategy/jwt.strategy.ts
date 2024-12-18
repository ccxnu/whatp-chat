import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import typia, { tags } from 'typia';

import { IActiveUser } from '@/core/repositories/active-user-data';
import { UserRoles } from '@/domain/enums/user-roles';
import { EnvService } from '@/infra/env/env.service';

interface UserPayload
{
  sub: string & tags.Format<'uuid'>;
  email: string & tags.Format<'email'>;
  roles: UserRoles;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
  constructor(private readonly config: EnvService)
  {
		let PUBLIC_KEY = config.get('JWT_PUBLIC_KEY');

    if (PUBLIC_KEY?.startsWith(`"`))
    {
      PUBLIC_KEY = PUBLIC_KEY.replaceAll(`"`, ``).replaceAll(`\\n`, `\n`);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
			secretOrKey: Buffer.from(PUBLIC_KEY, 'base64'),
			algorithms: ['RS256'],
    });
  }

  async validate(payload: IActiveUser)
  {
    return typia.assertEquals<UserPayload>(payload);
  }
}
