import { IsString, IsNotEmpty } from 'class-validator';

//LoginDto : 로그인 요청 시 클라이언트가 전달한 데이터를 받고 검증하는 DTO 클래스
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
