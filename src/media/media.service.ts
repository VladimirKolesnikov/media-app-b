import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly userService: UserService,
    private readonly storageService: StorageService,
  ) { }

  async create(createMediaDto: CreateMediaDto, file: Express.Multer.File, userId: number): Promise<MediaEntity> {
    const { title } = createMediaDto;
    const user = await this.userService.findOneById(userId);
    const key = await this.storageService.upload(file);

    try {
      const newMedia = this.mediaRepository.create({
        title,
        url: key,
        user,
      })
      return await this.mediaRepository.save(newMedia);

    } catch (err) {
      await this.storageService.remove(key);
      throw err;
    }
  }

  async findAllByUser(userId: number) {
    return await this.mediaRepository.find({
      where: {
        user: { id: userId },
      },
      // relations: ['user'],
    });
  }

  async findOneBy(id: string) {
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
