import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MemberCreateDto } from './dto/member.create.dto';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/member.dto';
import { MemberDetailDto } from './dto/member.detail.dto';
import * as bcrypt from 'bcrypt';
/**
 * 서비스 : 중복검사, 트랜잭션, 저장/조회 등 프론트 요구사항을 가장 많이 반영한다.
 */
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
  async signup(dto: MemberCreateDto): Promise<MemberDto> {
    //1) 이메일 중복 체크
    const emailExist = await this.memberRepository.checkEmail(dto.email);
    if (emailExist) {
      throw new ConflictException({
        code: 'EMAIL_DUPLICATED',
        message: '가입된 이메일입니다.',
        errors: [
          {
            field: 'email',
            message: '가입된 이메일입니다.',
          },
        ],
      });
    }
    //2) 아이디 중복 체크
    const idExist = await this.memberRepository.checkId(dto.memberId);
    if (idExist) {
      throw new ConflictException({
        code: 'ID_DUPLICATED',
        message: '사용중인 아이디입니다.',
        errors: [
          {
            field: 'memberId',
            message: '사용중인 아이디입니다.',
          },
        ],
      });
    }

    const hashedPwd = await bcrypt.hash(dto.memberPwd, 10);

    const savedDto = {
      ...dto,
      memberPwd: hashedPwd,
    };

    //3) 멤버 저장
    const memberNo = await this.memberRepository
      .insertMember(savedDto)
      .catch((e) => {
        console.error('DB error while signup:', e);
        throw new InternalServerErrorException({
          code: 'SIGNUP_FAILED',
          message: '회원가입 처리 중 오류가 발생했습니다.',
        });
      });

    //4) 최종 응답 DTO
    return {
      memberNo,
    };
  }

  /**
   * memberNo으로 회원 정보 조회
   */
  async findMemberByNo(memberNo: number): Promise<MemberDetailDto> {
    const member = await this.memberRepository.findMemberByNo(memberNo);

    if (!member) {
      throw new NotFoundException({
        code: 'GET_MEMBER_DETAIL_FAILED',
        message: '회원 정보를 불러오는 중 오류 발생',
      });
    }

    const result: MemberDetailDto = {
      memberId: member.memberId,
      email: member.email,
      createdAt: member.createdAt,
    };

    return result;
  }
}
