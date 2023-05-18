import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { SignInUserDto } from 'src/users/dto/signin_user.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  getUsers() {
    return this.userRepository.find()
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const date = new Date();
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(createUserDto.password, newUser.salt);

    newUser.created_at = date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', });  

    if (await this.userRepository.findOneBy({username:createUserDto.username})){
      return "User Already Exists";
    }

    return this.userRepository.save(newUser);
  }

  findUsersById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
  async findUsersByUsername(username: string) {
    return await this.userRepository.findOneBy({username:username})
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
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
