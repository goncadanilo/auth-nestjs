import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from '../../../shared/swagger/responses/auth.response';
import { ErrorResponse } from '../../../shared/swagger/responses/error.response';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User authentication' })
  @ApiOkResponse({ type: AuthResponse, description: 'Authentication token' })
  @ApiUnauthorizedResponse({ type: ErrorResponse, description: 'Unauthorized' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
