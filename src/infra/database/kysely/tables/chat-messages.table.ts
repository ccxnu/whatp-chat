import { ChatAuthor } from "@/domain/enums/chat-author";

export interface ChatMessagesTable
{
  id: string;
	session_id: string;
	author: ChatAuthor;
  content: string;
  date_created: Date;
}
