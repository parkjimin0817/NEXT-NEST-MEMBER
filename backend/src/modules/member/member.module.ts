import { Module } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { DatabaseModule } from 'src/database/database.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

/**
 * Spring의 @Configuration + Bean 묶음 같은 역할
 * 컨트롤러 + 서비스 + 리포지토리를 하나의 기능 그룹으로 묶어준다
 */
@Module({
  imports: [DatabaseModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberRepository],
})
export class MemberModule {}
