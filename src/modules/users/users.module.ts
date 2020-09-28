import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
})
export class UsersModule {}
