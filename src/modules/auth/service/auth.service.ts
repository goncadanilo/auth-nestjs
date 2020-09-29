import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
}
