import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { AcademicokRepository } from '@/application/academicok/academicok';
import { User } from '@/domain/entities/user';

@Injectable()
export class AcademicokIstsRepository implements AcademicokRepository
{
  private ACADEMICOK_ISTS_URL: string = "http://20.84.48.225:5056/api/emails/enviarDirecto";

  constructor(private readonly httpService: HttpService)
  {}

  async fetchUserInfo(cedula: string): Promise<User | null>
  {
    const response = await lastValueFrom<AxiosResponse<User>>(
      this.httpService
        .get(`${this.ACADEMICOK_ISTS_URL}/?${cedula}`)
      );

    if (!response.data) return null;

    // TODO: Parsear información para que se ajuste al usuario
    //const user = User.create({
    //  response.data
    //});

    return response.data;
  }
}
