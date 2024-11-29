import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface EmailVerificationProps
{
  userId: string;
  emailToken: string;
  dateCreated: Date;
	dateDeleted?: Date | null;
}

export class EmailVerification extends Entity<EmailVerificationProps>
{
	get userId()
  {
		return this.props.userId;
	}

	set userId(id: string)
  {
		this.props.userId = id;
	}

	get emailToken()
  {
		return this.props.emailToken;
	}

	set emailToken(token: string)
  {
		this.props.emailToken = token;
	}

	get dateCreated()
  {
		return this.props.dateCreated;
	}

	get dateDeleted()
  {
		return this.props.dateDeleted;
	}

	deleteEntity()
  {
		this.props.dateDeleted = new Date();
	}

	static create(
    props: Optional<EmailVerificationProps, 'dateCreated'>,
    id?: UniqueEntityId
  )
  {
		const emailVerification = new EmailVerification(
      {
        ...props,
				dateCreated: props.dateCreated ?? new Date(),
      },
      id
    );

		return emailVerification;
	}

}
