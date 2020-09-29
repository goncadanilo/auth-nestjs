import { Module } from '@nestjs/common';
import { UsersService } from '../users/service/users.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [UsersService],
  providers: [AuthService],
})
export class AuthModule {}
