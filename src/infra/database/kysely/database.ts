import { Kysely } from 'kysely'

import { CertificateTable } from './tables/certificate.table';
import { CourseTable } from './tables/course.table';
import { EmailVerificationTable } from './tables/email-verification.table';
import { EnrollmentTable } from './tables/enrollment.table';
import { FacturationTable } from './tables/facturation.table';
import { UserTable } from './tables/user.table';

export interface DatabaseTable
{
  user: UserTable;
  course: CourseTable;
  email_verification: EmailVerificationTable;
  enrollment: EnrollmentTable;
  certificate: CertificateTable;
  facturation: FacturationTable;
}


export class Database extends Kysely<DatabaseTable>
{}
