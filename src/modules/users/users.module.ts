import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from '../../shared/services/crypto.service';
import { UsersController } from './controller/users.controller';
import { Users } from './entity/users.entity';
import { UsersService } from './service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService, CryptoService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
