import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class MeResponseDto {
    @ApiProperty({
        example: '1',
        description: 'User`s auth info',
    })

    @Expose()
    userId: number;
};
