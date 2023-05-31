export interface RequestOptions {
  page: number;
  pageSize: number;
  orderBy: string;
  orderDir: 'ASC' | 'DESC',
  pesquisa: string;
}
