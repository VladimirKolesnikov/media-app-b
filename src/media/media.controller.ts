import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, HttpCode, HttpStatus, Res, ConsoleLogger, StreamableFile } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaInDto } from './dto/create-media.in.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RequestPayload } from 'src/decorators/request-payload.decorator';
import { plainToInstance } from 'class-transformer';
import { MediaOutDto } from './dto/media.out.dto';
import { ApiMedia } from './api.media';
import { QueryMediaDto } from './dto/query-media.dto';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { PresignedUrlOutDto } from './dto/presigned-url.out.dto';
// import { StorageService } from 'src/storage/storage.service';

@ApiMedia.forController()
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    // private readonly storageService: StorageService,
  ) { }

  @ApiMedia.forCreateMedia()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file')) // multer settings here
  async createMedia(
    @Body() createMediaDto: CreateMediaInDto,
    @UploadedFile() file: Express.Multer.File,
    @RequestPayload() reqPayload: JwtPayload,
  ) {
    const mediaEntity = await this.mediaService.create(createMediaDto, file, reqPayload.id);
    return plainToInstance(MediaOutDto, mediaEntity)
  }

  @ApiMedia.forGetMyMedia()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyMedia(
    @RequestPayload() reqPayload: JwtPayload,
    @Query() queryMediaDto: QueryMediaDto,
  ) {
    const { page, limit } = queryMediaDto;
    const mediaEntities = await this.mediaService.findAllByUser(reqPayload.id, page, limit);
    return plainToInstance(MediaOutDto, mediaEntities)
  }

  @Get('geturl/:id')
  // @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getUrl(@Param('id') id: string) {
    const url = await this.mediaService.getSignedUrl(id);
    return plainToInstance(PresignedUrlOutDto, url)
  }

  // @ApiMedia.forGetMediaById() // uncorrect logic: media should be an entity not buffer
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // @Get(':id')
  // async getMediaById(@Param('id') id: string) {
  //   const media = await this.mediaService.getOneAsBuffer(id);
  //   return plainToInstance(MediaOutDto, media);
  // }

  @ApiMedia.forGetMediaById()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getMediaById(@Param('id') id: string) {
    const media = await this.mediaService.getOneById(id);
    return plainToInstance(MediaOutDto, media);
  }
};
