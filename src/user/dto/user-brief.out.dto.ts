import { Expose } from "class-transformer";

export class UserBriefOutDto {

  @Expose()
  email: string;

  @Expose()
  id: number;
}
