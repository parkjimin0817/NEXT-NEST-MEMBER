// src/modules/member/dto/member.create.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class MemberCreateDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  memberId: string;

  @IsString()
  memberPwd: string;

  @IsEmail()
  email: string;
}
