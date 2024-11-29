import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationPipe implements PipeTransform
{
	constructor(private readonly schema: ZodSchema)
  {}

	transform(value: unknown)
  {
		try
    {
			const parsedValue = this.schema.parse(value);
			return parsedValue;
		}
    catch (error)
    {
			if (error instanceof ZodError)
      {
				throw new BadRequestException({
					message: 'Error de validación',
					statusCode: 400,
					errors: fromZodError(error),
				});
			}

			throw new BadRequestException('Error de validación');
		}
	}
}
