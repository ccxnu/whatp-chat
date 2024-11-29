import { HttpModule } from '@nestjs/axios';
import { Module } from "@nestjs/common";

import { TransformerRepository } from "@/application/transformer/transformer";
import { EnvModule } from '@/infra/env/env.module';

import { TikeeTransformerRepository } from "./transformer-tikee";

@Module({
  imports: [EnvModule, HttpModule],
  providers:
  [
    {
      provide: TransformerRepository,
      useClass: TikeeTransformerRepository,
    },
  ],
  exports: [TransformerRepository],
})
export class TransformerModule
{}
