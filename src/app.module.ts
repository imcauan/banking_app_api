import { Module } from '@nestjs/common';
import { CryptoModule } from './infra/crypto/Crypto.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './infra/jwt/Jwt.module';
import { UserModule } from './modules/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    CryptoModule,
    AuthModule,
    JwtModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
