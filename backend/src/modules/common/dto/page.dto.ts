/**
 * 페이지 메타 정보
 * 페이징에 공통으로 필요한 메타데이터 모음
 * 현재 페이지, 페이지 크기, 전체 개수, 전체 페이지 수
 */
export class PageMetaDto {
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

/**
 * 어떤 타입의 목록이든 페이징 형태로 감싸서 응답하기 위한 제네릭 DTO
 * 예) PageDto<BoardListItemDto>, PageDto<MemberListItemDto> 등
 */
export class PageDto<T> {
  items: T[];
  meta: PageMetaDto;

  constructor(items: T[], meta: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
