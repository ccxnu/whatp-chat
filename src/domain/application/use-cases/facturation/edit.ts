import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

type UseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | ResourceNotFoundError,
  object
>

@Injectable()
export class EditFacturationUseCase
{
  constructor()
  {}

  async execute(): Promise<UseCaseResponse>
  {
    return right({});
  }
}
