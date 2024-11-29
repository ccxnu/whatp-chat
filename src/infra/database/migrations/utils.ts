import { sql } from "kysely";

export function ENUM(...args: string[])
{
  return sql`enum(${sql.join(args.map((arg) => sql.raw(`'${arg}'`)))})`;
}
