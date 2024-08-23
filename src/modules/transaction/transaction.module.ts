import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { PrismaModule } from 'src/infra/prisma/Prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  exports: [TransactionService],
  providers: [TransactionService],
})
export class TransactionModule {}
