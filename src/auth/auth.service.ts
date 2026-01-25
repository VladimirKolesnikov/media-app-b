import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET_KEY: string;
  private readonly JWT_ACCESS_TTL: string;
  private readonly JWT_REFRESH_TTL: string;
  
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;
    const existingUser = await this.userService.findOneByEmail(email);

    if(existingUser) {
      throw new ConflictException('User with this email alerady exists') // 409 status code
    }

    const passwordHash = await bcrypt.hash(password, 10)

    return await this.userService.create({
      email,
      passwordHash,
    })
  }
}
