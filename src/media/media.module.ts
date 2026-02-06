import { forwardRef, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { StorageService } from 'src/storage/storage.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity, UserEntity]), forwardRef(() => UserModule)],
  controllers: [MediaController],
  providers: [MediaService, UserService, StorageService],
  exports: [MediaService]
})
export class MediaModule {}
