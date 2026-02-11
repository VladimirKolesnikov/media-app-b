import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CurrentUser } from "../types/current-user.type";
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
            // secretOrKey: configService.getOrThrow('JWT_SECRET_KEY'),
            secretOrKey: 'secretkey',
            algorithms: ['HS256'],
        })
    }

    async validate(payload: JwtPayload): Promise<CurrentUser> {
        let existingUser: UserEntity;

        try {
            existingUser = await this.userService.findOneById(payload.sub);
        } catch (err) {
            // Catch the error for changing message
            throw new NotFoundException('No user found for the given access token')
        }

        // check token version, user`s role etc.

        return { id: payload.sub }
    }
}
