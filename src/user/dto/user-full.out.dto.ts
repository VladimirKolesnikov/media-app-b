import { Expose, Type } from "class-transformer";
import { MediaOutDto } from "src/media/dto/media.out.dto";

export class UserFullOutDto {

  @Expose()
  email: string;

  @Expose()
  id: number;

  @Expose()
  nickname: string;

  @Expose()
  bio: string;
  
  @Expose()
  @Type(() => MediaOutDto)
  media: MediaOutDto[];

  @Expose()
  createdAt: Date;
}
