import { Kysely } from 'kysely'

import { ChatMessagesTable } from './tables/chat-messages.table';
import { ChatSessionsTable } from './tables/chat-sessions.table';
import { EmailVerificationTable } from './tables/email-verification.table';
import { UserTable } from './tables/user.table';

export interface DatabaseTable
{
  users: UserTable;
  chat_sessions: ChatSessionsTable;
  chat_messages: ChatMessagesTable;
  email_verification: EmailVerificationTable;
}


export class Database extends Kysely<DatabaseTable>
{}
