/**
 * 애플리케이션 전역 환경설정(configuration)을 정의하는 함수
 *
 * -.env파일의 값을 읽어 Nest ConfigModule에서 사용할 수 있는 형태로 변환한다.
 * - ConfigService.get('database.host')처럼 계층형 구조로 접근 가능해진다.
 * - 민감 정보(DB 비밀번호 등)는 절대 코드에서 직접 적지 않고 환경변수로 관리한다.
 */
export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    name: process.env.DB_NAME,
  },
});
