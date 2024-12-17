export interface ChatMessagesTable
{
  id: string;
	session_id: string;
	author_id: string;
  content: string;
  date_created: Date;
}
