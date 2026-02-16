import { Controller, Get, Post, Body, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiAuth } from './api.auth';
import { AuthResponseDto } from './dto/auth-response.dto';
import { MeResponseDto } from './dto/me-response.dto';
import { RequestPayload } from 'src/decorators/request-payload.decorator';
import { plainToInstance } from 'class-transformer';
import type { JwtPayload } from './types/jwt-payload.type';

@ApiAuth.forController()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiAuth.forRegister()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto
  ): Promise<AuthResponseDto> {
    const resDto = await this.authService.register(res, dto);
    return plainToInstance(AuthResponseDto, resDto);
  }

  @ApiAuth.forLogin()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto
  ): Promise<AuthResponseDto> {
    const resDto =  await this.authService.login(res, dto);
    return plainToInstance(AuthResponseDto, resDto);
  }

  @ApiAuth.forRefresh()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthResponseDto> {
    const resDto = await this.authService.refresh(req, res);
    return plainToInstance(AuthResponseDto, resDto);
  }

  @ApiAuth.forLogout()
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(
    @Res({ passthrough: true }) res: Response,
    @RequestPayload() reqPayload: JwtPayload,
  ): Promise<void> {
    return this.authService.logout(res, reqPayload.id);
  }

  @ApiAuth.forMe()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async checkCurrentUser(@RequestPayload() reqPayload: JwtPayload): Promise<MeResponseDto> {
    return { userId: reqPayload.id };
  }
}
