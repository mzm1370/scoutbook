import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import type { AuthUser, LoginResponse } from '@scoutbook/types';
import { AuthService } from '@api/auth/auth.service.js';
import { CurrentUser } from '@api/auth/decorators/current-user.decorator.js';
import { Public } from '@api/auth/decorators/public.decorator.js';
import {
  ApiFailureEnvelopeDto,
  AuthUserDto,
  LoginResponseDto,
} from '@api/auth/dto/auth-response.dto.js';
import { LoginDto } from '@api/auth/dto/login.dto.js';
import { RegisterDto } from '@api/auth/dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new team member' })
  @ApiCreatedResponse({ type: AuthUserDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiConflictResponse({
    type: ApiFailureEnvelopeDto,
    description: 'Email already registered',
  })
  register(@Body() dto: RegisterDto): Promise<AuthUser> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ type: ApiFailureEnvelopeDto })
  @ApiUnauthorizedResponse({
    type: ApiFailureEnvelopeDto,
    description: 'Invalid credentials',
  })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Return the authenticated user' })
  @ApiOkResponse({ type: AuthUserDto })
  @ApiUnauthorizedResponse({ type: ApiFailureEnvelopeDto })
  me(@CurrentUser() user: AuthUser): Promise<AuthUser> {
    return this.authService.me(user.id);
  }
}
