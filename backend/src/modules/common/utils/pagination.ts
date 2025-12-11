import { PageDto, PageMetaDto } from '../dto/page.dto';

export function createPage<T>(
  items: T[],
  totalCount: number,
  page: number,
  size: number,
): PageDto<T> {
  const totalPages = Math.ceil(totalCount / size);

  const meta: PageMetaDto = {
    page,
    size,
    totalCount,
    totalPages,
  };

  return new PageDto(items, meta);
}
