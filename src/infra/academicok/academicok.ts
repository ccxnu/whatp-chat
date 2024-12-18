import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { AcademicokRepository, UserIsts } from '@/application/academicok/academicok';
import { UserRoles } from '@/domain/enums/user-roles';

@Injectable()
export class AcademicokIstsRepository implements AcademicokRepository
{
  private ACADEMICOK_API_DOCENTE = "https://itsl.academicok.com/api?a=apidatosdocente&key=123&identificacion=";
  private ACADEMICOK_API_DATOS = "https://itsl.academicok.com/api?a=apidatospersona&key=j62kDJnltU4wVqp&identificacion=";

  constructor(private readonly httpService: HttpService)
  {}

  async fetchUserInfo(cedula: string): Promise<UserIsts | null>
  {
    // API PERSONAL
    const response = await lastValueFrom<AxiosResponse>(
      this.httpService.get(`${this.ACADEMICOK_API_DATOS}${cedula}`)
    );
    const userInfo = response.data.data;

    // Verifica si la propiedad 'data' no está vacía
    if (!userInfo || Object.keys(userInfo).length <= 0) return null;

    // API DOCENTE
    const responseDocente = await lastValueFrom<AxiosResponse>(
      this.httpService.get(`${this.ACADEMICOK_API_DOCENTE}${cedula}`)
    );
    const docenteInfo = responseDocente.data.data;

    // Verifica si la propiedad 'data' no está vacía
    if (!docenteInfo || Object.keys(docenteInfo).length <= 0)
    {
      const user = {
        fullName: userInfo.nombre,
        email: userInfo.email,
        role: UserRoles.ESTUDIANTE,
      } as UserIsts;

      return user;
    }
    else
    {
      const docente = {
        fullName: userInfo.nombre,
        email: userInfo.email,
        role: UserRoles.DOCENTE,
      } as UserIsts;

      return docente;
    }
  }
}
