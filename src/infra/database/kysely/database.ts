import { Kysely } from 'kysely'

import { CertificateTable } from './tables/certificate.table';
import { ChatMessagesTable } from './tables/chat-messages.table';
import { ChatSessionsTable } from './tables/chat-sessions.table';
import { CourseTable } from './tables/course.table';
import { EmailVerificationTable } from './tables/email-verification.table';
import { EnrollmentTable } from './tables/enrollment.table';
import { FacturationTable } from './tables/facturation.table';
import { UserTable } from './tables/user.table';

export interface DatabaseTable
{
  users: UserTable;
  chat_sessions: ChatSessionsTable;
  chat_messages: ChatMessagesTable;
  course: CourseTable;
  email_verification: EmailVerificationTable;
  enrollment: EnrollmentTable;
  certificate: CertificateTable;
  facturation: FacturationTable;
}


export class Database extends Kysely<DatabaseTable>
{}
