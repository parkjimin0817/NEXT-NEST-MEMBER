import { Controller, Body, Post } from '@nestjs/common';
import { MemberCreateDto } from './dto/member.create.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  /**
   * 아이디 중복 확인
   * GET / member / checkId
   */
  @Post('checkId')
  async checkId(@Body('memberId') memberId: string) {
    const exists = await this.memberService.checkId(memberId);
    return {
      success: true,
      exists, //true면 중복 false면 사용가능
      message: exists ? '사용중인 아이디입니다.' : '사용 가능한 아이디입니다.',
    };
  }

  /**
   * 이메일 중복 확인
   * GET / member / checkEmail
   */
  @Post('checkEmail')
  async checkEmail(@Body('email') email: string) {
    const exists = await this.memberService.checkEmail(email);
    return {
      success: true,
      exists, //true면 중복 false면 사용가능
      message: exists
        ? '이미 가입된 이메일입니다.'
        : '사용 가능한 이메일입니다.',
    };
  }

  /**
   * 회원가입
   * POST / member / signup
   */
  @Post('signup')
  signup(@Body() dto: MemberCreateDto) {
    return this.memberService.signup(dto);
  }
}
