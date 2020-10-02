import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  token: string;
}
