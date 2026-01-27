import { Controller, Get, Param, UseGuards, Req, createParamDecorator, ExecutionContext, HttpStatus, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUser } from './api-user';
import { RequestUser } from 'src/decorators/request-user.decorator';
import type { CurrentUser } from 'src/auth/types/current-user.type';

@ApiUser.forController()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiUser.forFindAll()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiUser.forUsersProfile()
  @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async usersProfile(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    // console.log(user)
    return user;
  }

  @ApiUser.forUsersMedia()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/media')
  async usersMedia(@Param('id') id: string) {
    const user = await this.userService.findOneById(+id);
    console.log(user)
    return user;
  }

  @ApiUser.forMyProfile()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async myProfile(@RequestUser() currentUser: CurrentUser) {
    return this.userService.findOneById(currentUser.id)
  }
}
