import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    //     message: 'Password must contain uppercase, lowercase and number',
    // })
    password: string;
}
