import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication/Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({ status: HttpStatus.CREATED})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'strin', example: 'a@b.com'},
        password: { type: 'string', example: 'qwerty'},
      }
    }
  })

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response, 
    @Body() dto: RegisterDto
  ) {
    return await this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response, 
    @Body() dto: LoginDto
  ) {
    return await this.authService.login(res, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request, 
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('tmp-route-auth-test')
  @HttpCode(HttpStatus.OK)
  async testGetCurrentUser(@Req() req: Request) {
    return req.user;
  }
}
