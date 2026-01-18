import { Type } from "class-transformer";
import { IsInt, IsString, IsUrl, Min } from "class-validator";

export class CreateMediaDto {
  @IsString()
  title: string;

  @IsUrl()
  url: string;

  // delete this late @Type(() => Number)
  @Type(() => Number)
  
  @IsInt()
  @Min(0)
  userId: number;
}
