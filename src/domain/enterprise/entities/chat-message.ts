import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface ChatMessageProps
{
  sessionId: UniqueEntityId;
  authorId: UniqueEntityId;
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

  get authorId()
  {
    return this.props.authorId;
  }

	set authorId(id: UniqueEntityId)
  {
		this.props.authorId = id;
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
