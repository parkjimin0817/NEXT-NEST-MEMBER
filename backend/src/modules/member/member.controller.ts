import {
  Controller,
  Body,
  Post,
  Get,
  ValidationPipe,
  Req,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberCreateDto } from './dto/member.create.dto';
import { MemberService } from './member.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('member')
export class MemberController {
  //DI : 의존성 주입, Nest가 알아서 객체 생성 + 수명 관리까지 해준다.
  constructor(private readonly memberService: MemberService) {}

  //테스트
  // @Get()
  // findAll() {
  //   throw new BadRequestException('잘못된 요청입니다.');
  // }

  /**
   * 아이디 중복 확인
   * POST / member / checkId
   * 컨트롤러가 서비스에 받은 값을 가공하면 await, async가 필요하다함
   */
  @Post('checkId')
  async checkId(@Body('memberId') memberId: string) {
    const exists = await this.memberService.checkId(memberId);
    return {
      exists, //true면 중복 false면 사용가능
      message: exists ? '사용중인 아이디입니다.' : '사용 가능한 아이디입니다.',
    };
  }

  /**
   * 이메일 중복 확인
   * POST / member / checkEmail
   */
  @Post('checkEmail')
  async checkEmail(@Body('email') email: string) {
    const exists = await this.memberService.checkEmail(email);
    return {
      exists, //true면 중복 false면 사용가능
      message: exists
        ? '이미 가입된 이메일입니다.'
        : '사용 가능한 이메일입니다.',
    };
  }

  /**
   * 회원가입
   * POST / member / signup
   * ValidationPipe을 적용하면 JSON body가 DTO에 자동으로 매핑되고 검증까지 해준다.
   */
  @Post('signup')
  signup(@Body(ValidationPipe) dto: MemberCreateDto) {
    return this.memberService.signup(dto);
  }

  /**
   * 마이페이지
   * GET / member / mypage
   */
  @UseGuards(JwtAuthGuard)
  @Get('mypage')
  getMyInfo(@Req() req) {
    console.log('토큰 payload:', req.user);
    const memberNo = Number(req.user.memberNo); // JWT에서 꺼낸 값
    return this.memberService.findMemberByNo(memberNo);
  }

  /**
   * 비밀번호 확인
   * POST / member / checkPwd
   */
  //@UseGuards(JwtAuthGuard)
  @Post('checkPwd')
  async checkPwd(@Req() req, @Body('memberPwd') memberPwd: string) {
    const memberNo = Number(req.user.memberNo); // JWT에서 꺼낸 값
    console.log('입력비번 :', memberPwd);
    const isMatched = await this.memberService.checkMemberPwd(
      memberNo,
      memberPwd,
    );
    return {
      isMatched, //true면 일치, false면 불일치
      message: isMatched ? '' : '비밀번호가 올바르지 않습니다.',
    };
  }

  /**
   * 탈퇴
   * DELETE / member / delete
   */
  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteMember(@Req() req, @Body('memberPwd') memberPwd: string) {
    const memberNo = Number(req.user.memberNo);

    const ok = await this.memberService.checkMemberPwd(memberNo, memberPwd);
    if (!ok) {
      throw new UnauthorizedException({
        code: 'PASSWORD_MISMATCH',
        message: '비밀번호가 일치하지 않습니다.',
        errors: [
          { field: 'memberPwd', message: '비밀번호가 일치하지 않습니다.' },
        ],
      });
    }

    await this.memberService.deleteMember(memberNo);
    return { success: true };
  }
}
