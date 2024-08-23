import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/prisma/Prisma.module';
import { JwtModule } from '../../infra/jwt/Jwt.module';
import { CryptoModule } from '../../infra/crypto/Crypto.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    CryptoModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
