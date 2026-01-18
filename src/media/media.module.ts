import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity, UserEntity])],
  controllers: [MediaController],
  providers: [MediaService, UserService],
})
export class MediaModule {}
