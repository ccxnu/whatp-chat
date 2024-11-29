import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';

import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
	imports:
  [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory(env: EnvService)
      {
				let PRIVATE_KEY = env.get('JWT_SECRET_KEY');
				let PUBLIC_KEY = env.get('JWT_PUBLIC_KEY');

        if (PRIVATE_KEY?.startsWith(`"`))
        {
          PRIVATE_KEY = PRIVATE_KEY.replaceAll(`"`, ``).replaceAll(`\\n`, `\n`);
        }
        if (PUBLIC_KEY?.startsWith(`"`))
        {
          PUBLIC_KEY = PUBLIC_KEY.replaceAll(`"`, ``).replaceAll(`\\n`, `\n`);
        }

				return {
					signOptions: { algorithm: 'RS256' },
					privateKey: Buffer.from(PRIVATE_KEY, 'base64'),
					publicKey: Buffer.from(PUBLIC_KEY, 'base64'),
				}
			},
		}),
	],
	providers:
  [
		JwtStrategy,
		EnvService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AuthModule
{}
