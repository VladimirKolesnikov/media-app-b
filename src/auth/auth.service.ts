import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { isDevMode } from 'src/utils/isDevMode';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly jwtAccessTtl: number;
  private readonly jwtRefreshTtl: number;
  private readonly cookieDomain: string;
  
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtAccessTtl = configService.getOrThrow('JWT_ACCESS_TTL');
    this.jwtRefreshTtl = configService.getOrThrow('JWT_REFRESH_TTL');
    this.cookieDomain = configService.getOrThrow('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password } = dto;
    const existingUser = await this.userService.findOneByEmail(email);

    if(existingUser) {
      throw new ConflictException('User with this email alerady exists') // 409 status code
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await this.userService.create({
      email,
      passwordHash,
    })

    return this.auth(res, newUser.id);
  }

  async login(res: Response, dto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = dto;
    let existingUser: UserEntity;

    try {
      existingUser = await this.userService.findOneByEmail(email);
    } catch(err) {
      throw new NotFoundException('Wrong email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);

    if(!isPasswordValid) {
      throw new NotFoundException('Wrong email or password')
    }

    return this.auth(res, existingUser.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Wrong refresh token');
    }

    const payload = await this.jwtService.verifyAsync(refreshToken);

    if (!payload || !payload.id) {
      throw new UnauthorizedException('Wrong refresh token');
    }

    const user = await this.userService.findOneById(payload.id)
    // "User not found exception" is thrown by UserServise

    return this.auth(res, user.id);
  }

  logout(res: Response): void {
    this.setCookie(res, 'refreshToken', new Date(0));
  }

  private auth(res: Response, id: number): AuthResponseDto {
    const { accessToken, refreshToken } = this.generateTokens(id);
    this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)); // refactor TTL

    return { accessToken };
  }

  private generateTokens(id: number) {
    const payload: JwtPayload = { sub: id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtAccessTtl,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtRefreshTtl,
    });

    return ({
      accessToken,
      refreshToken,
    });
  }

  private setCookie(res: Response, value: string, expiresIn: Date) {

    const isDev = isDevMode(this.configService);

    res.cookie('refreshToken', value, {
      httpOnly: true,
      // domain: this.COOKIE_DOMAIN,
      domain: isDev ? undefined : this.cookieDomain,
      path: '/',
      expires: expiresIn,
      secure: !isDev,
      sameSite: isDev ? 'lax' : 'none',
    })
  }
}

// Tasks to consider:
// - use nest`s responce without express
