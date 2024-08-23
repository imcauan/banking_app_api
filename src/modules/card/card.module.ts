import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { PrismaModule } from 'src/infra/prisma/Prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  exports: [CardService],
  providers: [CardService],
})
export class CardModule {}
