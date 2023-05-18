import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInUserDto } from 'src/users/dto/signin_user.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService  } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    getUsers() {
      return this.userService.getUsers();
    }

    @Get('id/:id')
    findUsersById(@Param('id', ParseIntPipe) id: number) {
      return this.userService.findUsersById(id);
    }

    @Delete('id/:id')
    deleteUserById(@Param('id', ParseIntPipe) id: number) {
      return this.userService.remove(id);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    createUsers(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }

    @Post('signin')
    @UsePipes(ValidationPipe)
    signInUsers(@Body() signInUsersDto: SignInUserDto) {
      return this.userService.signIn(signInUsersDto);
    }
}
