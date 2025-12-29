import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';
import { DataBaseService } from 'src/database/database.service';
import { BoardCreateDto } from './dto/board.create.dto';
import { BoardEntity } from './board.entity';
import { BoardListItemDto } from './dto/board.list.dto';

type InsertBoardRow = {
  boardNo: number;
};

type BoardListRow = {
  boardNo: number;
  boardTitle: string;
  memberNo: number;
  createdAt: Date;
  memberId: string;
};

@Injectable()
export class BoardRepository {
  constructor(private readonly db: DataBaseService) {}

  //게시글 등록
  async insertBoard(memberNo: number, board: BoardCreateDto): Promise<number> {
    return this.db.withTransaction<number>(async (client) => {
      const result: QueryResult<InsertBoardRow> = await client.query(
        `INSERT INTO board (member_no, board_title, board_content)
       VALUES ($1, $2, $3)
       RETURNING board_no AS "boardNo"`,
        [memberNo, board.boardTitle, board.boardContent],
      );

      if (result.rowCount !== 1) {
        throw new Error('게시글 저장 실패 : DB에서 반환된 값이 없습니다.');
      }

      return result.rows[0].boardNo;
    });
  }
  //게시글 수
  async countBoards(): Promise<number> {
    const result = await this.db.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM board`,
    );
    return Number(result.rows[0].count);
  }

  //게시글 목록 조회
  async getBoardListPaged(
    offset: number,
    limit: number,
  ): Promise<BoardListItemDto[]> {
    //boardListRow 뭐라고 정의하는디
    const result = await this.db.query<BoardListRow>(
      //조인 어케 해서 memberId 가져오는지
      `SELECT b.board_no AS "boardNo",
              b.board_title AS "boardTitle",
              b.member_no AS "memberNo",
              b.created_at AS "createdAt",
              m.member_id AS "memberId"
        FROM  board b
        JOIN member m ON b.member_no = m.member_no
        ORDER BY board_no DESC
        OFFSET $1
        LIMIT $2
      `,
      [offset, limit],
    );

    return result.rows.map((row) => ({
      boardNo: row.boardNo,
      boardTitle: row.boardTitle,
      memberNo: row.memberNo,
      memberId: row.memberId,
      createdAt: row.createdAt,
    }));
  }

  //게시글 상세 조회
  async getBoardDetail(boardNo: number): Promise<BoardEntity | null> {
    const result: QueryResult<BoardEntity> = await this.db.query(
      `SELECT b.board_no AS "boardNo",
              b.board_title AS "boardTitle",
              b.board_content As "boardContent",
              b.member_no AS "memberNo",
              b.created_at AS "createdAt",
              m.member_id AS "memberId"
        FROM  board b
        JOIN member m ON b.member_no = m.member_no
      WHERE board_no = $1`,
      [boardNo],
    );

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  }

  //게시글 삭제하기
  async deleteBoardByNo(memberNo: number, boardNo: number): Promise<number> {
    return this.db.withTransaction<number>(async (client) => {
      const result = await client.query(
        `DELETE FROM BOARD WHERE board_no = $1 AND member_no = $2`,
        [boardNo, memberNo],
      );
      return result.rowCount;
    });
  }

  //게시글 수정하기
  async updateBoard(memberNo: number, boardNo: number, board: BoardCreateDto): Promise<number> {
    return this.db.withTransaction<number>(async (client) => {
      const result = await client.query(
        `UPDATE board 
        SET board_title = $1,
            board_content = $2
        WHERE member_no = $3
        AND board_no = $4`,
        [board.boardTitle, board.boardContent, memberNo, boardNo],
      );

      if (result.rowCount === 0) {
        throw new Error('수정 권한이 없거나 게시글이 존재하지 않습니다.');
      }
      return boardNo;
    });
  }
}
