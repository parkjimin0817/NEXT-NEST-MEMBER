import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from '../member/member.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStartegy } from './startegies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('### MODULE SECRET =', config.get('JWT_SECRET'));
        console.log('### MODULE EXPIRES_IN =', config.get('JWT_EXPIRES_IN'));

        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
    MemberModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStartegy],
})
export class AuthModule {}
