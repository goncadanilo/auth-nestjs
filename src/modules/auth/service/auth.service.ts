import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../../shared/services/crypto.service';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    const correctPassword = await this.cryptoService.compareHash(
      password,
      user?.password,
    );

    if (correctPassword) {
      return { id: user.id, email: user.email };
    }

    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
