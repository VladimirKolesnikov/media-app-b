import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  url: string;
}
