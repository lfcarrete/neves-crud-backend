import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class UpdateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(1)
    first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(1)
    last_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(1)
    username: string;

}