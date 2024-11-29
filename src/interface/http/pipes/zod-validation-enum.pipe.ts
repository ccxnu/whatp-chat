import { BadRequestException, PipeTransform } from '@nestjs/common';
import { EnumLike, z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationEnumPipe<T extends EnumLike> implements PipeTransform
{
  private schema: any;

  constructor(enumType: T)
  {
    this.schema = z.nativeEnum(enumType).optional();
  }

  transform(value: string)
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
          message: "Valor 'enum' inválido",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException('Error de validación');
    }
  }
}
