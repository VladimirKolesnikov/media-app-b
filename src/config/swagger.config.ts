import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AuthModule } from "src/auth/auth.module";
import { MediaModule } from "src/media/media.module";
import { UserModule } from "src/user/user.module";

export const configureSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('media-app API')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        include: [
            AuthModule,
            // MediaModule,
            // UserModule,
        ]
    });

    SwaggerModule.setup('/documentation', app, document);
};
