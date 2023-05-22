import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  
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

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  password: string;

}