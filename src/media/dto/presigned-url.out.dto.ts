import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlOutDto {
  @ApiProperty({ description: 'Presigned URL to access video' })
  url: string;
}