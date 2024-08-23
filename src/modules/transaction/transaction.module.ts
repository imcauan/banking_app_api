import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaModule } from 'src/infra/prisma/Prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule)],
  controllers: [],
  exports: [TransactionService],
  providers: [TransactionService],
})
export class TransactionModule {}
