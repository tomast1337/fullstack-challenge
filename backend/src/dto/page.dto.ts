export class PageDto<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
