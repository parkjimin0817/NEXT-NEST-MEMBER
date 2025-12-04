import { ConflictException, Injectable } from '@nestjs/common';
import { MemberCreateDto } from './dto/member.create.dto';
import { MemberEntity } from './member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * 아이디 중복 확인
   */
  async checkId(memberId: string): Promise<boolean> {
    const exists = await this.memberRepository.checkId(memberId);
    return exists;
  }

  /**
   * 이메일 중복 확인
   * exists:true = 중복 이메일 존재
   */
  async checkEmail(email: string): Promise<boolean> {
    const exists = await this.memberRepository.checkEmail(email);
    return exists;
  }

  /**
   * 회원가입
   */
  async signup(dto: MemberCreateDto) {
    //1) 이메일 중복 체크
    const existsEmail = await this.memberRepository.checkEmail(dto.email);
    if (existsEmail) {
      throw new ConflictException(
        `이미 가입된 이메일입니다. email: ${dto.email}`,
      );
    }
    //2) 아이디 중복 체크
    const existsId = await this.memberRepository.checkId(dto.memberId);
    if (existsId) {
      throw new ConflictException(
        `사용중인 아이디 입니다. id: ${dto.memberId}`,
      );
    }
    //3) memberEntity 생성
    const member = new MemberEntity();
    member.email = dto.email;
    member.memberId = dto.memberId;
    member.memberPwd = dto.memberPwd;

    //4) member 저장
    //“DB에 실제로 저장된 MemberEntity”를 리턴
    const result = await this.memberRepository.insertMember(member);

    //5) 응답
    if (!result) {
      return {
        success: false,
        message: '회원가입에 실패했습니다.',
      };
    }

    return {
      success: true,
      message: '회원가입 성공했습니다.',
      data: {
        memberId: dto.memberId,
        email: dto.email,
      },
    };
  }
}
