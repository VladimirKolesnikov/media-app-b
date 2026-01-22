import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { TypeormConfig } from './typeorm.config';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeormConfig, UserModule, MediaModule, StorageModule, AuthModule],
})
export class AppModule {}
