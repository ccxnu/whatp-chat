import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { MailerRepository } from '@/application/mailer/mailer';
import { DateFormat } from '@/core/entities/date';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { EmailVerification } from '@/domain/entities/email-verification';
import { User } from '@/domain/entities/user';
import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class TikeeMailerRepository implements MailerRepository
{
  private AUTOMATIZACIONES_TIKEE_URL: string = "http://20.84.48.225:5056/api/emails/enviarDirecto";
  private EMAIL_SENDER: string;


  constructor(
    private readonly config: EnvService,
    private readonly httpService: HttpService
  )
  {
    this.EMAIL_SENDER = this.config.get('EMAIL_SENDER');
  }

  private createMailOptions(
    user: User,
    idRequest: string,
    date: DateFormat,
    process: string,
    plantilla: string,
    emailTokenOrPassword: string,
    asunto: string,
    ip: string,
    dispositivo: string,
  )
{
    return {
      idUser: user.id.toString(),
      idInstitution: 0,
      idSolution: 0,
      idRequest,
      processDate: date.currentDateTime(),
      process,
      tipo: "EMAIL",
      prioridad: "MEDIA",
      destinos: [user.email],
      plantilla,
      lista_vals_email: [
        `${user.fullName.toUpperCase()}`,
        user.email,
        emailTokenOrPassword,
        date.currentDate(),
        date.currentTime(),
        ip,
        dispositivo,
      ],
      lista_vars_email: [
        "[nom_usuario]",
        "[nom_email]",
        "[token]",
        "[fecha]",
        "[hora]",
        "[ip]",
        "[dispositivo]",
      ],
      asunto,
      nom_envia: "automatizaciones@tikee.tech",
      correo_envia: this.EMAIL_SENDER,
      intentos: 2
    };
  }

  async sendVerifyEmail(user: User, emailVerification: EmailVerification, ip: string, userAgent: string): Promise<void>
  {
    const date = new DateFormat(emailVerification.dateCreated);

    const mailOptions = this.createMailOptions(
      user,
      emailVerification.id.toString(),
      date,
      "VERIFY_EMAIL_USER",
      "equinoccio/web_verification_email.html",
      emailVerification.emailToken,
      "Verificación de correo electrónico",
      ip,
      userAgent,
    );

    const response = await lastValueFrom(
      this.httpService
        .post(
          this.AUTOMATIZACIONES_TIKEE_URL,
          mailOptions,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      );

    if (response.data.code === 'COD_ERR')
    {
      throw new Error('Error al enviar el correo');
    }
  }

  async sendForgotPasswordEmail(user: User, tempPassword: string, ip: string, userAgent: string): Promise<void>
  {
    const request_id = new UniqueEntityId().toString();
    const date = new DateFormat();

    const mailOptions = this.createMailOptions(
      user,
      request_id,
      date,
      "RESET_PASS_USER",
      "equinoccio/web_reset_password.html",
      tempPassword,
      "Reseteo de credenciales de usuario",
      ip,
      userAgent,
    );

    const response = await lastValueFrom(
      this.httpService
        .post(
          this.AUTOMATIZACIONES_TIKEE_URL,
          mailOptions,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      );

    if (response.data.code === 'COD_ERR')
    {
      throw new Error('Error al enviar el correo');
    }
  }
}
