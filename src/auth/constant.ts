import { ConfigModule, ConfigService } from '@nestjs/config';
ConfigModule.forRoot();

export const jwtConstants = {
    secret: process.env.SECRET_KEY_AUTH,
  };