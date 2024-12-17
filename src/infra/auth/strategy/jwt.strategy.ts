import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';

import { UserRoles } from '@/domain/enums/user-roles';
import { EnvService } from '@/infra/env/env.service';

const tokenPayloadSchema = z.object({
	sub: z.string().uuid(),
	email: z.string().email(),
	role: z.nativeEnum(UserRoles),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

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

  async validate(payload: UserPayload)
  {
    return tokenPayloadSchema.parse(payload);
  }
}
