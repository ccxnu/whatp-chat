import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { ChatAuthor } from '@/domain/enums/chat-author';

interface ChatMessageProps
{
  sessionId: UniqueEntityId;
  author: ChatAuthor;
  content: string;
  dateCreated: Date;
}

export class ChatMessage extends Entity<ChatMessageProps>
{
  get sessionId()
  {
    return this.props.sessionId;
  }

	set sessionId(id: UniqueEntityId)
  {
		this.props.sessionId = id;
	}

  get author()
  {
    return this.props.author;
  }

	set author(author: ChatAuthor)
  {
		this.props.author = author;
	}

  get content()
  {
    return this.props.content;
  }

  set content(message: string)
  {
    this.props.content = message;
  }

  get dateCreated()
  {
    return this.props.dateCreated;
  }

  set dateCreated(time: Date)
  {
    this.props.dateCreated = time;
  }

	static create(props: Optional<ChatMessageProps, 'dateCreated'>, id?: UniqueEntityId)
  {
		const message = new ChatMessage(
      {
        ...props,
				dateCreated: props.dateCreated ?? new Date(),
      },
      id
    );

		return message;
	}
}
