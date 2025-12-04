// src/modules/member/member.entity.ts

/**
 * Nest/Typescript = Typescript 타입 + Javascript의 기본 객체(Date 등)
 */
export class MemberEntity {
  memberNo: number;
  memberId: string;
  memberPwd: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
