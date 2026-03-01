import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterInDto } from './dto/register.in.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginInDto } from './dto/login.in.dto';
import type { Request, Response } from 'express';
import { isDevMode } from 'src/utils/isDevMode';
import { AuthOutDto } from './dto/auth.out.dto';
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
    // this.jwtAccessTtl = process.env.JWT_ACCESS_TTL;
    // this.jwtRefreshTtl = process.env.JWT_REFRESH_TTL;
    // this.cookieDomain = process.env.COOKIE_DOMAIN;

    this.jwtAccessTtl = 1000 * 60 * 60;
    this.jwtRefreshTtl = 1000 * 60 * 60 * 24;
    this.cookieDomain = 'localhost';
  }

  async register(res: Response, dto: RegisterInDto): Promise<AuthOutDto> {
    const { email, password } = dto;

    let existingUser: UserEntity | null = null;

    try {
      existingUser = await this.userService.findOneByEmail(email);
    } catch (_err) {
      // do nothing. It`s OK
    }

    if (existingUser) {
      throw new ConflictException('User with this email alerady exists') // 409 status code
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await this.userService.create({
      email,
      passwordHash,
    })

    const { id, tokenVersion, role } = newUser;
    const payload: JwtPayload = { id, tokenVersion, role };

    return this.auth(res, payload);
  }

  async login(res: Response, dto: LoginInDto): Promise<AuthOutDto> {
    const { email, password } = dto;
    let existingUser: UserEntity;

    try {
      existingUser = await this.userService.findOneByEmail(email);
    } catch (err) {
      throw new NotFoundException('Wrong email or password')
    }
console.log('------------', existingUser)
    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isPasswordValid) {
      throw new NotFoundException('Wrong email or password')
    }

    const { id, tokenVersion, role } = existingUser;
    const payload: JwtPayload = { id, tokenVersion, role };

    return this.auth(res, payload);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Wrong refresh token');
    }

    const currentPayload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!currentPayload || !currentPayload.id) {
      throw new UnauthorizedException('Wrong refresh token');
    }

    await this.userService.incrementTokenVersion(currentPayload.id)
    const user = await this.userService.findOneById(currentPayload.id)

    const newPayload: JwtPayload = {
      id: user.id,
      tokenVersion: user.tokenVersion,
      role: user.role,
    }

    return this.auth(res, newPayload);
  }

  async logout(res: Response, id: number): Promise<void> {
    await this.userService.incrementTokenVersion(id);
    this.setCookie(res, 'null', new Date(0));
  }

  private auth(res: Response, payload: JwtPayload): AuthOutDto {
    const { accessToken, refreshToken } = this.generateTokens(payload);
    this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)); // refactor TTL

    return { accessToken };
  }

  private generateTokens(payload: JwtPayload) {

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
