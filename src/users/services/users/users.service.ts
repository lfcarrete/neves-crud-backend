import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
      ) {}

    getUsers() {
        return this.userRepository.find()
    }

      createUser(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto);
        const date = new Date();

        newUser.created_at = date.toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo', });

        return this.userRepository.save(newUser);
      }
          
      findUsersById(id: number) {
        return this.userRepository.findOneBy({ id });
      }

      async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
      }
}
