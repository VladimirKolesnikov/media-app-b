import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMediaInDto } from './dto/create-media.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { StorageService } from 'src/storage/storage.service';
import { MediaLoadStatus } from './types/mediaLoadStatus';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly storageService: StorageService,
  ) { }

  async create(createMediaDto: CreateMediaInDto, file: Express.Multer.File, userId: number): Promise<MediaEntity> {
    const media = await this.mediaRepository.save({
      originalName: createMediaDto.originalName,
      user: { id: userId },
      status: MediaLoadStatus.PENDING,
    });

    const key = media.id

    try {
      await this.storageService.upload(file, key);
      media.status = MediaLoadStatus.READY;
      return await this.mediaRepository.save(media);
    } catch (err) {
      media.status = MediaLoadStatus.FAILED;
      await this.mediaRepository.save(media);

      throw new InternalServerErrorException(
        'Failed to upload media',
        { cause: err },
      );
    }
  }

  async findAllByUser(userId: number, page: number, limit: number) {
    const [items, _total] = await this.mediaRepository
      .createQueryBuilder('media')
      .where('media.user_id = :userId', { userId })
      .orderBy('media.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return items;
  }

  async getOneById(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async getSignedUrl(id) {
    const media = await this.getOneById(id);
    const url = await this.storageService.generateVideoUrl(media.id);
    return url;
  }

  async remove(id: string) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    const key = media.id;
    await this.storageService.remove(media.id);
    await this.mediaRepository.remove(media)

    return { message: 'deleted' }
  }
}
