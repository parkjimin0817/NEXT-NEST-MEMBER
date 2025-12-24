import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

/**
 * PostgreSQL 커넥션 풀(pool)을 생성하고 관리하는 역할을 담당하는 서비스
 *
 * 특징 :
 * - Nest 애플리케이션에서 공통적으로 사용하는 DB 접근 레이어
 * - ConfigService를 통해 환경변수(.env)의 DB 설정값을 읽어온다.
 * - Repository 계층이 이 서비스이 query() 메서드를 사용하여 SQL 실행.
 * - 애플리케이션 종료 시 pool 연결을 안정하게 종료하기 위해 OnModuleDestroy 인터페이스를 구현한다.
 *
 * 장점 :
 * - 각 Repository에서 pool을 새로 만들 필요가 없어진다.
 * - DB 연결 관리가 한 곳에서 이루어져 유지보수가 용이해진다.
 * - 실무에서 가장 많이 사용하는 구조 : "DB 모듈 + DB 서비스" 조합
 */

@Injectable()
export class DataBaseService implements OnModuleDestroy {
  //PostgreSQL 연결 풀 인스턴스
  private readonly pool: Pool;

  //생성자 : ConfigService를 통해 .env 파일에 있는 설정값을 주입받아 PostgreSQL Pool을 초기화한다.
  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      user: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
    });
  }

  /**
   * 공통 SQL 실행 메서드
   * - Repository 계층에서 사용하는 핵심 메서드
   * - 제네릭 T를 사용하여 SQL 결과 타입을 명확하게 정의할 수 있다.
   * - QueryResult<T> 형태로 결과를 반환하므로 타입 안정성이 높아진다.
   * - text: SQL 문자열
   * - params: SQL 파라미터 배열
   */
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  //트랜잭션 클라이언트 빌려오기
  async getClient() {
    return this.pool.connect();
  }

  //트랜잭션 처리 유틸
  async withTransaction<T>(
    handler: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await handler(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * NestJS가 모듈을 종료할 때 자동으로 호출되는 메서드
   * - DB 연결 풀을 종료하여 연결 누수를 방지한다.
   * - 서버가 종료될 때 반드시 pool을 닫아주는 것이 중요하다.
   */
  async onModuleDestroy() {
    await this.pool.end();
  }
}
