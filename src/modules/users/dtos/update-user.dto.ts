import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  password?: string;
}
