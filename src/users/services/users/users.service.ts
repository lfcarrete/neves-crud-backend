import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { SignInUserDto } from 'src/users/dto/signin_user.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update_user.dto';
import { GetUserDto } from 'src/users/dto/get_users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async getUsers() {
    const users = await this.userRepository.find()
    const results = []

    users.map((user) => {
      const userDto = new GetUserDto();
      userDto.id = user.id;
      userDto.name = user.name;
      userDto.username = user.username;
      userDto.created_at = user.created_at;
      results.push(userDto)
    })

    return results
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const date = new Date();
    newUser.created_at = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', });  
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(createUserDto.password, newUser.salt);

    if (await this.userRepository.findOneBy({username:createUserDto.username})){
      return "User Already Exists";
    }
    await this.userRepository.save(newUser);
    return {
      name: newUser.name,
      username: newUser.username,
      created_at: newUser.created_at,
      id: newUser.id
    };
  }

  async updateUserById(updateUserDto: UpdateUserDto){
    const user = this.findUsersById(updateUserDto.id);
    if(!user){
      return "User not found";
    }
    (await user).name = updateUserDto.name;
    (await user).username = updateUserDto.username;
    await this.userRepository.save(await user);
    return updateUserDto;
  }

  findUsersById(id: number) {
    return this.userRepository.findOneBy({ id });
  }


  async findUsersByUsername(username: string) {
    return await this.userRepository.findOneBy({username:username})
  }

  async remove(id: number): Promise<string> {
    if (! await this.findUsersById(id)){
      return "User does not exist."
    } 
    await this.userRepository.delete(id);
    return "Successfully deleted."
  }

  async signIn(signInUserDto: SignInUserDto) {

    const foundUser = await this.findUsersByUsername(signInUserDto.username);
    if (!foundUser){
      return "User or Password do not match."
    }
    if (await this.hashPassword(signInUserDto.password, foundUser.salt) == foundUser.password){
      const payload = { username: foundUser.username, sub: foundUser.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
        token_type:"bearer"
      }; 
    } else {
      return "User or Password do not match."
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    for(let i = 0; i < 3; i++){
      password = password + salt;
    }
    const crypto = require("crypto");
    const sha256Hasher = crypto.createHmac("sha256", salt);
    const hash = sha256Hasher.update(password).digest('hex');
    return hash;
  }
}
