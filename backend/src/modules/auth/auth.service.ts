import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberRepository } from '../member/member.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

/**
 * 로그인 인증을 처리하는 서비스
 * 1. memberId로 사용자 조회
 * 2. 비밀번호 비교
 * 3. JWT 토큰 생성 후 반환
 */

@Injectable()
export class AuthService {
  constructor(
    private readonly memberRepository: MemberRepository,
    //JWT 토큰 생성을 담당하는 Nest 제공 서비스
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.memberRepository.findMemberById(dto.memberId);
    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    const match = await bcrypt.compare(dto.password, user.memberPwd);
    if (!match) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    //JWT payload 생성
    const payload = { sub: user.memberNo, memberId: user.memberId };

    return {
      //jwtService.sign(payload)를 사용하면 .env의 JWT_SECRET 기반으로 서명된 토큰 생성
      accessToken: this.jwtService.sign(payload),
    };
  }
}
