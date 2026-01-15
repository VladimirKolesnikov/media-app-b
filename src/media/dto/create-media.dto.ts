import { IsString, IsUrl } from "class-validator";

export class CreateMediaDto {
  
  @IsString()
  title: string;

  @IsUrl()
  url: string;
}
