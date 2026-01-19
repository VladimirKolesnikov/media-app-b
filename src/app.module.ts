import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { TypeormConfig } from './typeorm.config';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [TypeormConfig, UserModule, MediaModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
