import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RequestUser } from 'src/decorators/request-user.decorator';
import type { CurrentUser } from 'src/auth/types/current-user.type';
import { plainToInstance } from 'class-transformer';
import { MediaResponseDto } from './dto/media-response.dto';
import { ApiMedia } from './api.media';
import { QueryMediaDto } from './dto/query-media.dto';
import type { Response } from 'express';

@ApiMedia.forController()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @ApiMedia.forCreateMedia()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file')) // multer settings here
  async createMedia(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() currentUser: CurrentUser,
  ) {
    const mediaEntity = await this.mediaService.create(createMediaDto, file, currentUser.id);
    return plainToInstance(MediaResponseDto, mediaEntity)
  }

  @ApiMedia.forGetMyMedia()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyMedia(
    @RequestUser() currentUser: CurrentUser,
    @Query() queryMediaDto: QueryMediaDto,
  ) {
    const { page, limit } = queryMediaDto;
    const mediaEntities = await this.mediaService.findAllByUser(currentUser.id, page, limit);
    return plainToInstance(MediaResponseDto, mediaEntities)
  }

  @ApiMedia.forGetMediaById()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getMediaById(@Param('id') id: string) {
    return this.mediaService.findOneById(id);
  }

  // delete own media
  @Delete(':id')
  removeMyMedia(@Param('id') id: string) {
    console.log(id)
    return this.mediaService.remove(id);
  }
}
