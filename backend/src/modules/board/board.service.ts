import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { BoardCreateDto } from './dto/board.create.dto';
import { BoardDetailDto } from './dto/board.detail.dto';
import { BoardListItemDto } from './dto/board.list.dto';
import { PageDto } from '../common/dto/page.dto';
import { BoardListQueryDto } from './dto/board-list-query.dto';
import { createPage } from '../common/utils/pagination';

@Injectable()
export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  //게시글 등록
  async insertBoard(memberNo: number, dto: BoardCreateDto): Promise<number> {
    const boardNo = await this.boardRepository.insertBoard(memberNo, dto);
    return boardNo;
  }

  //게시글 목록 조회
  async getBoardListPaged(
    query: BoardListQueryDto,
  ): Promise<PageDto<BoardListItemDto>> {
    const page = query.page ?? 1;
    const size = query.size ?? 10;
    const offset = (page - 1) * size;

    const [totalCount, items] = await Promise.all([
      this.boardRepository.countBoards(),
      this.boardRepository.getBoardListPaged(offset, size),
    ]);

    return createPage(items, totalCount, page, size);
  }

  //게시글 상세 조회
  async getBoardDetail(boardNo: number): Promise<BoardDetailDto> {
    const board = await this.boardRepository.getBoardDetail(boardNo);
    if (!board) {
      throw new NotFoundException({
        code: 'GET_BOARD_DETAIL_FAILED',
        message: '게시글 상제 정보를 불러오는 중 오류 발생',
      });
    }
    const result: BoardDetailDto = {
      boardNo: board.boardNo,
      boardTitle: board.boardTitle,
      boardContent: board.boardContent,
      createdAt: board.createdAt,
      memberNo: board.memberNo,
      memberId: board.memberId,
    };
    return result;
  }

  //게시글 삭제하기
  async deleteBoard(memberNo: number, boardNo: number): Promise<void> {
    const result = await this.boardRepository.deleteBoardByNo(
      memberNo,
      boardNo,
    );
    if (result === 0) {
      throw new NotFoundException({
        code: 'DELETE_BOARD_FAILED',
        message: '게시글 삭제 처리 중 오류 발생했습니다.',
      });
    }
  }
}
