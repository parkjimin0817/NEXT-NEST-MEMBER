/**
 * JWT 내부에 저장되는 실제 데이터(클레임, Claims)의 타입 정의
 *
 * - sub : 토큰의 subject (주체), 일반적으로 사용자 고유 식별자(PK)
 * - memberId : 로그인한 사용자의 계정 아이디
 */
export interface JwtPayload {
  sub: number; //토큰의 subject (보통 memberNo)
  memberId: string;
}
