/**
 * 게시글 목록에서 한 행을 표현하는 DTO
 * 즉, 게시판 목록의 한 아이템 데이터 형태
 */
export class BoardListItemDto {
  boardNo: number;
  boardTitle: string;
  memberNo: number | null;
  createdAt: Date;

  memberId: string | null;
}

/**
 * 위 아이템 + 페이징 정보까지 합쳐서 게시판 목록 전체 응답을 표현하는 DTO
 */
export class BoardListPageDto {
  items: BoardListItemDto[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}
