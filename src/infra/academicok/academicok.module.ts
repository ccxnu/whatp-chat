import { HttpModule } from '@nestjs/axios';
import { Module } from "@nestjs/common";

import { AcademicokRepository } from '@/application/academicok/academicok';

import { AcademicokIstsRepository } from './academicok';

@Module({
  imports: [HttpModule],
  providers:
  [
    {
      provide: AcademicokRepository,
      useClass: AcademicokIstsRepository,
    },
  ],
  exports: [AcademicokRepository],
})
export class AcademicokModule
{}
