import { Module } from '@nestjs/common'

// UseCases
import { EditAdminUseCase } from '@/application/use-cases/administrator/edit';
import { RegisterAdminUseCase } from '@/application/use-cases/administrator/register';
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
// Modules
import { AcademicokModule } from '@/infra/academicok/academicok.module';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { MailerModule } from '@/infra/mailer/mailer.module';

// Controllers
import { EditAdminAccountController } from './controllers/administrator/edit.controller';
import { RegisterAdminAccountController } from './controllers/administrator/register.controller';
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

	]
})
export class HttpModule
{}
