import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DuplicateKeyExceptionFilter } from '../../../shared/exception-filters/duplicate-key.exception-filter';
import { ErrorResponse } from '../../../shared/swagger/responses/error.response';
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
  @UseFilters(DuplicateKeyExceptionFilter)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UsersResponse, description: 'Created User' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Bad Request' })
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(data);
  }
}
