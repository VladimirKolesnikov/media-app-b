import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    const { title, url, userId } = createMediaDto;
    const user = await this.userService.findOne(userId);
    const newMedia = this.mediaRepository.create({
      title,
      url,
      user,
    })

    return await this.mediaRepository.save(newMedia);
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
