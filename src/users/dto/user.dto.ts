import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

}