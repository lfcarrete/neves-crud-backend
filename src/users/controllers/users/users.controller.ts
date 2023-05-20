import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignInUserDto } from 'src/users/dto/signin_user.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { AuthGuard } from '../../../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/dto/update_user.dto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService) { }

  @Post('login')
  @UsePipes(ValidationPipe)
  async signInUsers(@Body() signInUsersDto: SignInUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const login = await this.userService.signIn(signInUsersDto);
    if(login == "User or Password do not match."){
      return login;
    }
    const { access_token } = login;
    res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
    }).send({ status: 'ok' });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('id/:id')
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUsersById(id);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete('id/:id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('create')
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('update')
  @UsePipes(ValidationPipe)
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserById(updateUserDto);
  }
}
