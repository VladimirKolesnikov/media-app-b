
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUser } from './api-user';
import { RequestPayload } from 'src/decorators/request-payload.decorator';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { MediaService } from 'src/media/media.service';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@ApiUser.forController()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mediaService: MediaService,
  ) { }

  @ApiUser.forGetUsers()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return plainToInstance(UserResponseDto, users);
  }

  @ApiUser.forGetUserById()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    // console.log(user)
    return user;
  }

  @ApiUser.forGetUserMedia()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/media')
  async getUserMedia(@Param('id') id: string) {
    const media = await this.mediaService.findAllByUser(+id, 1, 100)
    console.log(media)
    return 'get user media'
  }

  @ApiUser.forMyProfile()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async myProfile(@RequestPayload() reqPayload: JwtPayload) {
    return this.userService.findOneById(reqPayload.id)
  }
}
