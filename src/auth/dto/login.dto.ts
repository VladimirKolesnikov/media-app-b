import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'user@mail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123',
        minLength: 6,
        description: 'Must contain uppercase, lowercase and number',
    })
    @IsString()
    @MinLength(6)
    password: string;
}
