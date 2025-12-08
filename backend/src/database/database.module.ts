import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataBaseService } from './database.service';

/**
 * 애플리케이션 전역에서 사용할 데이터베이스 연결(Pool)을 관리하는 모듈
 *
 * - DataBaseService를 생성하고 DI컨테이너에 등록한다.
 * - 다른 모듈(MemberModule, AuthModule 등)이 DB 연결이 필요할 때 DataBaseService를 자유롭게 사용할 수 있도록 export 한다.
 * - ConfigModule을 import 하여 .env 기반 설정값 (DB_HOST, DB_PORT 등)을 DataBaseService 내부에서 읽어올 수 있게 한다.
 *
 * - DB 커넥션 설정을 한 곳에서 관리함으로써 중복 방지 및 구조적 안정성을 확보
 * - 서비스/리포지토리 파일에서 직접 pool 을 만들지 않고 이 모듈을 통해 관리하여 테스트와 유지보수에 유리한 구조 생성
 */

@Module({
  imports: [ConfigModule],
  providers: [DataBaseService],

  /**
   * Provider(service)를 export 하는 것은 Nest DI 시스템 관점
   * Nest DI 컨테이너에서 다른 모듈이 이 Provider를 사용할 수 있게 허용하는 것
   */
  exports: [DataBaseService],
})

/**
 * Module을 export 하는 것은 TypeScript 관점
 * 파일을 외부에서 import 가능하게 만드는 것
 */
export class DatabaseModule {}
