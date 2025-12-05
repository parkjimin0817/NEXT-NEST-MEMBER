import { Injectable } from '@nestjs/common';
import { db } from 'src/database/database.provider';
import { MemberEntity } from './member.entity';

@Injectable()
export class MemberRepository {
  /**
   * 이메일 중복 체크
   */
  async checkEmail(email: string): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM member WHERE email = $1 LIMIT 1`,
      [email],
    );
    //중복있으면 true , 없으면 false
    return result.rowCount > 0;
  }

  /**
   * 아이디 중복 체크
   */
  async checkId(memberId: string): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM member WHERE member_id = $1 LIMIT 1`,
      [memberId],
    );
    //중복있으면 true , 없으면 false
    return result.rowCount > 0;
  }

  /**
   * 회원 저장
   */
  async insertMember(
    member: MemberEntity,
  ): Promise<{ memberId: string; email: string }> {
    const result = await db.query(
      `INSERT INTO member (member_id, email, member_pwd)
       VALUES ($1, $2, $3)
       RETURNING member_id, email`,
      [member.memberId, member.email, member.memberPwd],
    );

    if (result.rowCount !== 1) {
      throw new Error('회원 저장 실패: DB에서 반환된 값이 없습니다.');
    }

    const row = result.rows[0];

    return {
      memberId: row.member_id,
      email: row.email,
    };
  }
}
