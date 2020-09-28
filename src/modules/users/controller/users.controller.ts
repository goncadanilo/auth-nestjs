import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersResponse } from '../../../shared/swagger/responses/users.response';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Users } from '../entity/users.entity';
import { UsersService } from '../service/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UsersResponse, description: 'Created user' })
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(data);
  }
}
