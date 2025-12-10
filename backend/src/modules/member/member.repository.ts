import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { QueryResult } from 'pg';
import { MemberCreateDto } from './dto/member.create.dto';
import { MemberEntity } from './member.entity';

type InsertMemberRow = {
  memberNo: number;
};
type ExistsRow = {
  exists: boolean;
};

@Injectable()
export class MemberRepository {
  constructor(private readonly db: DataBaseService) {}
  /**
   * 이메일 중복 체크
   */
  async checkEmail(email: string): Promise<boolean> {
    const result: QueryResult<ExistsRow> = await this.db.query(
      `
      SELECT EXISTS (
        SELECT 1 FROM member WHERE email = $1
      ) AS "exists"
      `,
      [email],
    );

    return result.rows[0].exists;
  }

  /**
   * 아이디 중복 체크
   */
  async checkId(memberId: string): Promise<boolean> {
    const result: QueryResult<ExistsRow> = await this.db.query(
      ` SELECT EXISTS (
        SELECT 1 FROM member WHERE member_id = $1
      ) AS "exists"`,
      [memberId],
    );

    return result.rows[0].exists;
  }

  /**
   * 회원 저장
   */
  async insertMember(member: MemberCreateDto): Promise<number> {
    const result: QueryResult<InsertMemberRow> = await this.db.query(
      `INSERT INTO member (member_id, email, member_pwd)
       VALUES ($1, $2, $3)
       RETURNING member_no AS "memberNo"`,
      [member.memberId, member.email, member.memberPwd],
    );

    if (result.rowCount !== 1) {
      throw new Error('회원 저장 실패: DB에서 반환된 값이 없습니다.');
    }

    return result.rows[0].memberNo;
  }

  /**
   * memberNo으로 회원정보 불러오기
   */
  async findMemberByNo(memberNo: number): Promise<MemberEntity | null> {
    const result: QueryResult<MemberEntity> = await this.db.query(
      `SELECT member_no AS "memberNo", member_id AS "memberId", email, created_at AS "createdAt"
      FROM member
      WHERE member_no = $1`,
      [memberNo],
    );

    // 결과가 없으면 null 반환
    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findMemberById(memberId: string): Promise<MemberEntity | null> {
    const result: QueryResult<MemberEntity> = await this.db.query(
      `
      SELECT
        member_no   AS "memberNo",
        member_id   AS "memberId",
        email,
        member_pwd  AS "memberPwd",
        created_at  AS "createdAt"
      FROM member
      WHERE member_id = $1
      `,
      [memberId],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  //비밀번호 포함 멤버 정보
  async findMemberWithPwdByNo(memberNo: number): Promise<MemberEntity | null> {
    const result: QueryResult<MemberEntity> = await this.db.query(
      `SELECT member_no AS "memberNo", member_id AS "memberId", member_pwd AS "memberPwd", email, created_at AS "createdAt"
      FROM member
      WHERE member_no = $1`,
      [memberNo],
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  }

  //멤버 삭제
  async deleteMemberByNo(memberNo: number): Promise<number | null> {
    const result = await this.db.query(
      `DELETE FROM member WHERE member_no = $1`,
      [memberNo],
    );

    return result.rowCount;
  }
}
