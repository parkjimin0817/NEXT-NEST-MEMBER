import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardCreateDto } from './dto/board.create.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardService } from './board.service';
import { BoardListQueryDto } from './dto/board-list-query.dto';
import { BoardListItemDto } from './dto/board.list.dto';
import { PageDto } from '../common/dto/page.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  //게시글 등록하기
  @UseGuards(JwtAuthGuard)
  @Post()
  async postBoard(@Req() req, @Body() dto: BoardCreateDto) {
    const memberNo = Number(req.user.memberNo);
    const savedBoardNo = await this.boardService.insertBoard(memberNo, dto);
    return {
      boardNo: savedBoardNo,
    };
  }

  //게시글 목록 불러오기
  //@UseGuards(JwtAuthGuard)
  @Get()
  async getBoardList(
    @Query() query: BoardListQueryDto,
  ): Promise<PageDto<BoardListItemDto>> {
    return this.boardService.getBoardListPaged(query);
  }

  //게시글 상세 불러오기
  @UseGuards(JwtAuthGuard)
  @Get(':boardNo')
  async getBoardDetail(@Param('boardNo', ParseIntPipe) boardNo: number) {
    return this.boardService.getBoardDetail(boardNo);
  }

  //게시글 삭제하기
  @UseGuards(JwtAuthGuard)
  @Delete(':boardNo')
  async deleteBoard(
    @Req() req,
    @Param('boardNo', ParseIntPipe) boardNo: number,
  ) {
    const memberNo = Number(req.user.memberNo);
    await this.boardService.deleteBoard(memberNo, boardNo);
  }

  //게시글 수정하기
  @UseGuards(JwtAuthGuard)
  @Patch(':boardNo')
  async updateBoard(@Req() req, @Param('boardNo', ParseIntPipe) boardNo: number, @Body() dto: BoardCreateDto){
    const memberNo = Number(req.user.memberNo);
    const updatedBoardNo =  await this.boardService.updateBoard(memberNo, boardNo, dto);
    return {
      boardNo : updatedBoardNo
    }
  }
}
