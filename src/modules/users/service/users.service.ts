import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
  ) {}
}
