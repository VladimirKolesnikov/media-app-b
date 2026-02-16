import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../types/jwt-payload.type";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_SECRET_KEY'),
            algorithms: ['HS256'],
        })
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        let existingUser: UserEntity;

        try {
            existingUser = await this.userService.findOneById(payload.id);
        } catch (err) {
            // Catch the error for changing error message
            throw new NotFoundException('No user found for the given access token')
        }

        // check token version, user`s role etc.
        if (existingUser.tokenVersion != payload.tokenVersion) {
            throw new UnauthorizedException()
        }

        return payload;
    }
}
