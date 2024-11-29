import { UseCaseError } from '@/core/errors/use-case-error';

/**
 * @example
 * Inform at least one of there queies with at least two characters: {queries}
 * @queries
 * String of required params
 */
export class MinQuerySearchNotProviedError extends Error implements UseCaseError
{
	constructor(queries: string)
  {
		super(
			`Debes proveer al menos un parámetro con al menos dos caracteres: ${queries}`,
		)
	}
}
