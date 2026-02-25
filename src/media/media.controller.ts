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
    const media = await this.mediaService.getOneById(id)
    return plainToInstance(MediaOutDto, media);
  }

  @Get('/download/:id')
  // async getMediaAsStream(@Param('id') id: string) {
  //   console.log('in controller /stream/:id')
  //   const r = await this.mediaService.getOneAsBuffer(id);
  //   // console.log(r)
  //   // return `from stream id - ${id}`
  //   return r;
  // }
  async getMediaAsStream(@Param('id') id: string) {
    // const { buffer, mime } = await this.mediaService.getOneAsBuffer(id);
    const { buffer } = await this.mediaService.getOneAsBuffer(id);

    // return new StreamableFile(buffer, {
    //   type: mime,
    //   disposition: 'inline', // for opening in browser
    // });
  }

  @Get('/:id/buffer')
  async downloadMedia(@Param('id') id: string) {
    // console.log('in media/id/buffer ---------')
    await this.mediaService.getOneAsBuffer(id)
  }

  @Delete(':id')
  removeMyMedia(@Param('id') id: string) {
    console.log(id)
    return this.mediaService.remove(id);
  }

};
