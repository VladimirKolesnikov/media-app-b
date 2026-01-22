import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { TypeormConfig } from './typeorm.config';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeormConfig,
    UserModule,
    MediaModule,
    StorageModule,
    AuthModule],
})
export class AppModule {}
