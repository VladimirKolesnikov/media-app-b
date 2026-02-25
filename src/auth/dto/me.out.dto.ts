import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class MeOutDto {
    // @ApiProperty({
    //     example: '1',
    //     description: 'User`s auth info',
    // })

    @Expose()
    id: number;

    @Expose()
    tokenVersion: number;

    @Expose()
    role: string;

    @Expose()
    email: string;
};
