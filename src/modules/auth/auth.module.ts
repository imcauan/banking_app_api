import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/Prisma.module';
import { JwtModule } from '../infra/jwt/Jwt.module';
import { CryptoModule } from '../infra/crypto/Crypto.module';

@Module({
  imports: [PrismaModule, JwtModule, CryptoModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class AuthModule {}
