import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
<<<<<<< HEAD
=======
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
>>>>>>> c06ed0d361d65085dc787f2750e4fb8247b65d62

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
<<<<<<< HEAD
=======

  const config = new DocumentBuilder()
    .setTitle('media-app API')
    .setContact('CapyBit Ltd', 'https://github.com/VladimirKolesnikov/media-app-b', 'e@mail.com')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule]
  });
  SwaggerModule.setup('/documentation', app, document);

>>>>>>> c06ed0d361d65085dc787f2750e4fb8247b65d62
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
