import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DuplicateKeyExceptionFilter } from '../../../shared/exception-filters/duplicate-key.exception-filter';
import { ErrorResponse } from '../../../shared/swagger/responses/error.response';
import { UsersResponse } from '../../../shared/swagger/responses/users.response';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
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
  @ApiCreatedResponse({ type: UsersResponse, description: 'Created user' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Bad Request' })
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return this.usersService.createUser(data);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ type: UsersResponse, description: 'Updated user' })
  @ApiNotFoundResponse({ type: ErrorResponse, description: 'Not Found' })
  async updateUser(
    @Request() req: any,
    @Body() data: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.updateUser(req.user.id, data);
  }
}
