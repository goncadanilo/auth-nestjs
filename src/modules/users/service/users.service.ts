import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from '../../../shared/services/crypto.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Users } from '../entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
    private cryptoService: CryptoService,
  ) {}

  async createUser(data: CreateUserDto): Promise<Users> {
    const user = this.repository.create(data);
    user.password = await this.cryptoService.generateHash(user.password);

    return await this.repository.save(user);
  }

  async findUserByEmail(email: string): Promise<Users> {
    return await this.repository.findOne({ email });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<Users> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.repository.update(id, { ...data });

    return this.repository.create({ ...user, ...data });
  }
}
