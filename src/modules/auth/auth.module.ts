import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/service/users.service';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersService, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
