import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersService } from './service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService],
})
export class UsersModule {}
