import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Users } from '../entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) {}

  async createUser(data: CreateUserDto): Promise<Users> {
    const user = this.repository.create(data);
    user.password = hashSync(user.password, 8);
    return await this.repository.save(user);
  }
}
