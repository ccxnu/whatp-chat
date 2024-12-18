export interface PaginationParams
{
  /**
   * Valor de página para la paginación
   * @minimum 1
   */
  page: number;

  /**
   * Number of items perPage
   * @maximum 20
   */
	perPage: number;
}
