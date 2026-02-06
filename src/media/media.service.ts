import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly storageService: StorageService,
  ) { }

  async create(createMediaDto: CreateMediaDto, file: Express.Multer.File, userId: number): Promise<MediaEntity> {
    const { originalName } = createMediaDto;
    const key = await this.storageService.upload(file);

    try {
      const newMedia = this.mediaRepository.create({
        originalName,
        url: key,
        user: { id: userId},
      })
      return await this.mediaRepository.save(newMedia);

    } catch (err) {
      await this.storageService.remove(key);
      throw new InternalServerErrorException('Failed to save media information');
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

  async findOneById(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async remove(id: string) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    const key = media.url;
    await this.storageService.remove(media.url);
    await this.mediaRepository.remove(media)

    return { message: 'deleted' }
  }
}
