import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MailerRepository } from '@/application/mailer/mailer';
import { EnvModule } from '@/infra/env/env.module';

import { TikeeMailerRepository } from './mailer-tikee';


@Module({
  imports: [EnvModule, HttpModule],
	providers:
  [
		{
			provide: MailerRepository,
			useClass: TikeeMailerRepository,
		},
	],
	exports: [MailerRepository],
})
export class MailerModule
{}
