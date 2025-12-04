// src/modules/member/dto/member.create.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class MemberCreateDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  memberId: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  memberPwd: string;

  @IsEmail()
  email: string;
}
