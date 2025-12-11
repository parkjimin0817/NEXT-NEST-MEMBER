import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * 모든 페이징 목록에서 공통으로 쓸 쿼리 DTO
 */
export class PaginationQueryDto {
  @IsOptional()
  //"2"를 number로 변환해줌
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}
