import { Exclude, Expose, Type } from "class-transformer";
import { MediaResponseDto } from "src/media/dto/media-response.dto";


export class UserResponseDto {

  @Expose()
  email: string;
}
