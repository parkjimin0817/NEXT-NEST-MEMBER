import { PaginationQueryDto } from 'src/modules/common/dto/pagination-query.dto';

/**
 * GET /boards?page=1&size=10 이런 요청의 쿼리 파라미터를 받는 DTO.
 * PaginationQueryDto(공통 page/size 정의)를 상속하여 쓴다.
 * 나중에 keyword, category 등 조회 필터를 추가할 때 여기에 추가할 수 있다.
 * 즉, 게시판 목록에서 사용하는 쿼리 파라미터 DTO + 페이징 공통 로직 재사용
 */
export class BoardListQueryDto extends PaginationQueryDto {
  //keyword?: string;
  //category?: string;
}
