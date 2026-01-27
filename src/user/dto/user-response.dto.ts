import { Exclude, Expose, Type } from "class-transformer";
import { MediaResponseDto } from "src/media/dto/media-response.dto";

@Exclude()
export class UserResponseDto {
  // @Expose()
  // id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => MediaResponseDto)
  media: MediaResponseDto[];
}
