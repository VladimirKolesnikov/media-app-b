import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { TypeormConfig } from './typeorm.config';

@Module({
  imports: [TypeormConfig, UserModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
