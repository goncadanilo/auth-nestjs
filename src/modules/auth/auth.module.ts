import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/service/users.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersService, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
