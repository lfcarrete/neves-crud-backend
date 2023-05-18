import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { SignInUserDto } from 'src/users/dto/signin_user.dto';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async signIn(signInUserDto: SignInUserDto) {

    const foundUser = await this.userRepository.findOneBy({username:signInUserDto.username})
    if (!foundUser){
      return "User or Password do not match."
    }
    if (await this.hashPassword(signInUserDto.password, foundUser.salt) == foundUser.password){
      return "Signed In"
    } else {
      return "User or Password do not match."
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
