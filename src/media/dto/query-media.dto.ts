import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class QueryMediaDto {
    @ApiPropertyOptional({
        example: 1,
        default: 1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        example: 100,
        default: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10
}
