import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class LoginInDto {
    @ApiProperty({
        example: 'user@mail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        example: 'Password123',
        minLength: 6,
        description: 'Must contain uppercase, lowercase and number',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must contain uppercase, lowercase and number',
    })
    password: string;
}
