import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateMediaInDto {
  @ApiProperty({ example: 'awesome picture.jpg'})
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  originalName: string;
}
