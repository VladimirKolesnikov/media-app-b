import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInDto } from './dto/create-user.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async create(createUserDto: CreateUserInDto): Promise<UserEntity> {
    const { passwordHash, email } = createUserDto;
    const newUser = this.userRepository.create({ email, passwordHash });
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user;
  }

  async findOneWithMedia(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['media'],
    });

    return user;
  }

  async incrementTokenVersion(userId: number) {
    return await this.userRepository.increment({ id: userId }, 'tokenVersion', 1)
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return user;
  }
}
