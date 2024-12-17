import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

interface ChatSessionProps
{
  userId: UniqueEntityId;
  startedAt: Date;
  closedAt?: Date | null;
}

export class ChatMessage extends Entity<ChatSessionProps>
{
  get userId()
  {
    return this.props.userId;
  }

	set userId(id: UniqueEntityId)
  {
		this.props.userId = id;
	}

  get startedAt()
  {
    return this.props.startedAt;
  }

  set startedAt(time: Date)
  {
    this.props.startedAt = time;
  }

  get closedAt()
  {
    return this.props.closedAt;
  }

	closeSession()
  {
		this.props.closedAt = new Date();
	}

	static create(props: Optional<ChatSessionProps, 'startedAt'>, id?: UniqueEntityId)
  {
		const message = new ChatMessage(
      {
        ...props,
				startedAt: props.startedAt ?? new Date(),
      },
      id
    );

		return message;
	}
}
