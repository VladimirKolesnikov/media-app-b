import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiAuth } from './api.auth';
import { AuthResponseDto } from './dto/auth-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { RequestUser } from 'src/decorators/request-user.decorator';
import type { CurrentUser } from './types/current-user.type';

@ApiAuth.forController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiAuth.forRegister()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response, 
    @Body() dto: RegisterDto
  ): Promise<AuthResponseDto> {
    return await this.authService.register(res, dto);
  }

  @ApiAuth.forLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response, 
    @Body() dto: LoginDto
  ): Promise<AuthResponseDto> {
    return await this.authService.login(res, dto);
  }

  @ApiAuth.forRefresh()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(req, res);
  }

  @ApiAuth.forLogout()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    this.authService.logout(res);
  }
  // Add token version for logout instantly?

  @ApiAuth.forMe()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async checkCurrentUser(@RequestUser() currentUser: CurrentUser): Promise<MeResponseDto> {
    return { userId: currentUser.id };
  }
}
