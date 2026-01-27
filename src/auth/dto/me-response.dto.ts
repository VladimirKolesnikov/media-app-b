import { ApiProperty } from "@nestjs/swagger";

export class MeResponseDto {
    @ApiProperty({
        example: '1',
        description: 'User`s auth info',
    })
    userId: number;
};
