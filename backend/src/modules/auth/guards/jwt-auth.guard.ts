import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 전략(jwt strategy)을 기반으로 요청(request)의 인증 여부를 판단하는 Guard
 * - 클라이언트가 보낸 요청 헤더의 Authorization: bearer <token> 값을 읽는다.
 * - 내부적으로 Passport의 jwtStrategy 를 실행하여 토큰을 검증한다.
 * - 토큰이 유효하면 요청을 Controller로 통과시키고 유효하지 않으면 401 unauthorized 예외를 자동으로 발생시킨다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
