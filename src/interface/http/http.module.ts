import { Module } from '@nestjs/common'

import { EditAdminUseCase } from '@/application/use-cases/administrator/edit';
import { RegisterAdminUseCase } from '@/application/use-cases/administrator/register';
import { DownloadCertificateUseCase } from '@/application/use-cases/certificate/download-certificate';
import { SearchCertificateUseCase } from '@/application/use-cases/certificate/search-by-cedula';
import { CreateCourseUseCase } from '@/application/use-cases/course/create';
import { DeleteCourseUseCase } from '@/application/use-cases/course/delete';
import { EditCourseUseCase } from '@/application/use-cases/course/edit';
import { RecoverCourseUseCase } from '@/application/use-cases/course/recover';
import { SearchByFilterCourseUseCase } from '@/application/use-cases/course/search-by-filter';
import { SearchByQueryCourseUseCase } from '@/application/use-cases/course/search-by-query';
import { ViewCourseUseCase } from '@/application/use-cases/course/view';
import { CreateEnrollmentUseCase } from '@/application/use-cases/enrollment/create';
import { EditEnrollmentUseCase } from '@/application/use-cases/enrollment/edit';
import { SearchByFilterEnrollmentUseCase } from '@/application/use-cases/enrollment/search-by-filter';
import { CreateFacturationUseCase } from '@/application/use-cases/facturation/create';
import { EditFacturationUseCase } from '@/application/use-cases/facturation/edit';
import { ViewFacturationUseCase } from '@/application/use-cases/facturation/view';
import { AuthenticateUserUseCase } from '@/application/use-cases/user/authenticate';
import { ChangeUserPasswordUseCase } from '@/application/use-cases/user/change-password';
import { DeleteUserUseCase } from '@/application/use-cases/user/delete';
import { EditUserUseCase } from '@/application/use-cases/user/edit';
import { FetchUserUseCase } from '@/application/use-cases/user/fetch';
import { ForgotPasswordUseCase } from '@/application/use-cases/user/forgot-password';
import { RecoverUserUseCase } from '@/application/use-cases/user/recover';
import { RegisterUserUseCase } from '@/application/use-cases/user/register';
import { SearchUserUseCase } from '@/application/use-cases/user/search';
import { SendEmailTokenUseCase } from '@/application/use-cases/user/send-email-token';
import { VerifyEmailUseCase } from '@/application/use-cases/user/verify-email';
import { ViewUserUseCase } from '@/application/use-cases/user/view';
import { AcademicokModule } from '@/infra/academicok/academicok.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { MailerModule } from '@/infra/mailer/mailer.module';
import { TransformerModule } from '@/infra/transformer/transformer.module';

import { EditAdminAccountController } from './controllers/administrator/edit.controller';
import { RegisterAdminAccountController } from './controllers/administrator/register.controller';
import { DownloadCertificateController } from './controllers/certificate/download-certificate';
import { SearchCertificateController } from './controllers/certificate/search-by-cedula';
import { CreateCourseController } from './controllers/course/create.controller';
import { DeleteCourseController } from './controllers/course/delete.controller';
import { EditCourseController } from './controllers/course/edit.controller';
import { RecoverCourseController } from './controllers/course/recover.controller';
import { SearchByFilterCourseController } from './controllers/course/search-by-filter.controller';
import { SearchByQueryCourseController } from './controllers/course/search-by-query.controller';
import { ViewCourseController } from './controllers/course/view.controller';
import { CreateEnrollmentController } from './controllers/enrollment/create.controller';
import { EditEnrollmentController } from './controllers/enrollment/edit.controller';
import { SearchByFilterEnrollmenteController } from './controllers/enrollment/search-by-filter';
import { FilterUserEnrollmenteController } from './controllers/enrollment/user-search-by-filter';
import { CreateFacturationController } from './controllers/facturation/create.controller';
import { EditFacturationController } from './controllers/facturation/edit.controller';
import { ViewFacturationController } from './controllers/facturation/view.controller';
import { AuthenticateUserController } from './controllers/user/authenticate.controller';
import { ChangeUserPasswordController } from './controllers/user/change-password.controller';
import { DeleteUserAccountController } from './controllers/user/delete.controller';
import { EditUserAccountController } from './controllers/user/edit.controller';
import { FetchUserAccountController } from './controllers/user/fetch.controller';
import { ForgotPasswordController } from './controllers/user/forgot-password.controller';
import { SendEmailTokenController } from './controllers/user/re-send-email-token.controller';
import { RecoverUserAccountController } from './controllers/user/recover.controller';
import { RegisterUserAccountController } from './controllers/user/register-account.controller';
import { SearchUserAccountController } from './controllers/user/search.controller';
import { VerifyEmailController } from './controllers/user/verify-email.controller';
import { ViewUserAccountController } from './controllers/user/view.controller';

@Module({
	imports:
  [
    DatabaseModule,
    CryptographyModule,
    MailerModule,
    TransformerModule,
    AcademicokModule,
  ],
	controllers:
  [
    RegisterAdminAccountController,
    EditAdminAccountController,

    AuthenticateUserController,
    RegisterUserAccountController,
    VerifyEmailController,
    ForgotPasswordController,
    SendEmailTokenController,
    ChangeUserPasswordController,
    DeleteUserAccountController,
    EditUserAccountController,
    FetchUserAccountController,
    RecoverUserAccountController,
    SearchUserAccountController,
    ViewUserAccountController,

    CreateCourseController,
    DeleteCourseController,
    RecoverCourseController,
    EditCourseController,
    SearchByFilterCourseController,
    SearchByQueryCourseController,
    ViewCourseController,

    CreateEnrollmentController,
    EditEnrollmentController,
    SearchByFilterEnrollmenteController,
    FilterUserEnrollmenteController,

    SearchCertificateController,
    DownloadCertificateController,

    CreateFacturationController,
    EditFacturationController,
    ViewFacturationController,

	],
	providers:
  [
    RegisterAdminUseCase,
    EditAdminUseCase,

    AuthenticateUserUseCase,
    RegisterUserUseCase,
    VerifyEmailUseCase,
    ForgotPasswordUseCase,
    SendEmailTokenUseCase,
    ChangeUserPasswordUseCase,
    DeleteUserUseCase,
    EditUserUseCase,
    FetchUserUseCase,
    RecoverUserUseCase,
    SearchUserUseCase,
    ViewUserUseCase,

    CreateCourseUseCase,
    DeleteCourseUseCase,
    RecoverCourseUseCase,
    EditCourseUseCase,
    SearchByFilterCourseUseCase,
    SearchByQueryCourseUseCase,
    ViewCourseUseCase,

    CreateEnrollmentUseCase,
    EditEnrollmentUseCase,
    SearchByFilterEnrollmentUseCase,

    SearchCertificateUseCase,
    DownloadCertificateUseCase,

    CreateFacturationUseCase,
    EditFacturationUseCase,
    ViewFacturationUseCase,

	]
})
export class HttpModule
{}
