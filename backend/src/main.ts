//NestFactory 가져오기 : Nest 애플리케이션을 생성하는 핵심 팩토리
import { NestFactory } from '@nestjs/core';
//루트 모듈 (AppModule) 가져오기 : Nest는 모듈 기반 구조라서 AppModule을 기반으로 서버 구성
import { AppModule } from './app.module';
//class-validator 데코레이터를 실행시켜주는 nest의 필터
import { ValidationPipe } from '@nestjs/common';
import { SuccessResponseInterceptor } from './modules/common/interceptors/success-response.interceptor';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';

/**
 * 앱을 시작(부트스트랩)하는 비동기 함수
 * Nest서버를 띄우는 시작점
 * Node.js서버는 비동기 초기화가 많아서 async 사용
 */
async function bootstrap() {
  //Nest 애플리케이션 인스턴스 생성
  const app = await NestFactory.create(AppModule);

  //1) DTO 기반 유효성 검증
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의 안 된 필드는 날려버림
      forbidNonWhitelisted: true, // DTO에 없는 필드 들어오면 에러
      transform: true, // 타입 변환 (문자 → 숫자 등)
    }),
  );

  //2) 전역 예외 필터 (에러 응답 통일)
  app.useGlobalFilters(new HttpExceptionFilter());

  //3) 성공 응답 래핑
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  //CORS 허용 설정 : 프론트는 4000, 백은 4001 => 4000에서 오는 요청은 허용해라
  app.enableCors({
    origin: 'http://localhost:4000',
  });

  //Nest 서버를 4001번 포트에서 실행
  await app.listen(4001);
}

//실행
bootstrap();
