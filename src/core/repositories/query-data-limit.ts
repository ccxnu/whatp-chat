import { PaginationParams } from "./pagination-params";

export interface QueryDataLimitParams extends PaginationParams
{
  /**
   * It can also be a keyword or sentence you want to search for
   * @maxLength 200
   */
	query: string;
}
