import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class MediaResponseDto {
  @ApiProperty({
    example: '00535b05-3b7d-4ab6-ad74-65f3526ed2d4.jpg',
  })
  @Expose()
  url: string;

  @ApiProperty({
    example: '2026-02-08T17:43:21.750Z',
  })
  @Expose()
  createdAt: Date;
}
