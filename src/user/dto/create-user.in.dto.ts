import { IsString, MinLength } from "class-validator";

export class CreateUserInDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  passwordHash: string;
}
