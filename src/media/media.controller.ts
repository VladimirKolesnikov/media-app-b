import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from 'src/decorators/request-user.decorator';
import type { CurrentUser } from 'src/auth/types/current-user.type';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // upload a media to the my page
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file')) // multer settings here
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: CurrentUser,
  ) {
    const mediaEntity = await this.mediaService.create(createMediaDto, file, user.id);
    return mediaEntity;
  }

  // show own media
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findAll(@RequestUser() currentUser: CurrentUser) {
    return this.mediaService.findAllByUser(currentUser.id);
  }

  // show a media (for access to a media)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.mediaService.findOne(+id);
  }

  // delete own media
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(id)
    return this.mediaService.remove(id);
  }
}
