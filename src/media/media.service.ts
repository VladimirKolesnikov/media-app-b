import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
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

  async create(createMediaDto: CreateMediaDto, file: Express.Multer.File) {
    const { title, userId } = createMediaDto;
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
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

  async findAll() {
    return await this.mediaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
