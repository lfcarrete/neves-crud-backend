import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from '../typeorm/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from '../auth/constant';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
