import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

export class CreateMediaDto {
  @ApiProperty({ example: 'awesome picture.jpg'})
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  originalName: string;
}
