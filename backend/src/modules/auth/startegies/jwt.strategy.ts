import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT 토큰이 유효한지 검증하는 Passport 전략
 * - 클라이언트 요청의 Authorization 헤더에서 Bearer 토큰을 읽는다.
 * - 토큰의 서명(Signature)을 SECRET 키로 검증한다.
 * - 토큰이 조작되었거나 만료되었으면 401 에러 발생
 * - 토큰이 유효하면 decode된 payload를 validate()에 전달한다.
 */
@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy) {
  constructor() {
    //Strategy 설정 옵션
    super({
      //Http요청의 헤더에 bearer 형식의 jwt를 자동 추출하는 함수
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //jwt 서명을 검증할 때 사용하는 비밀 키, signature가 조작되었으면 즉시 실패 처리
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * - Passport가 토큰 검증을 끝내고 정상적인 payload를 전달해주는 단계
   * - 이 반환값은 request.user에 자동으로 저장
   */
  validate(payload: JwtPayload) {
    return { memberNo: payload.sub, memberId: payload.memberId };
  }
}
