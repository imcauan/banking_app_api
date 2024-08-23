import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/infra/prisma/Prisma.module';
import { FileModule } from '../file/file.module';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { CryptoModule } from 'src/infra/crypto/Crypto.module';
import { CardModule } from '../card/card.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => TransactionModule),
    FileModule,
    CryptoModule,
    forwardRef(() => AuthModule),
    CardModule,
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
