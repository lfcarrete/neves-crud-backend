import { ConfigModule, ConfigService } from '@nestjs/config';
ConfigModule.forRoot();

export const jwtConstants = {
    secret: "ABC",
  };