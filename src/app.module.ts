import { Module } from '@nestjs/common';
import { CryptoModule } from './modules/infra/crypto/Crypto.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './modules/infra/jwt/Jwt.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CryptoModule, AuthModule, JwtModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
