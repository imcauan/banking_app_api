import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/Prisma.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { UserService } from '../user/user.service';
import { TransactionType } from './enums/transaction-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(data: CreateTransactionDto): Promise<void> {
    const targetUser = await this.userService.findOne(data.to);
    const fromUser = await this.userService.findOne(data.from);

    if (data.value > fromUser.balance) {
      throw new ForbiddenException(
        'The value cannot be bigger than your balance.',
      );
    }

    await this.prisma.transaction.create({
      data: {
        from: data.from,
        to: data.to,
        type: data.type,
        value: data.value,
      },
    });

    await this.prisma.user.update({
      where: { id: targetUser.id },
      data: {
        balance:
          data.type === TransactionType.DEPOSIT
            ? (targetUser.balance -= data.value)
            : (targetUser.balance += data.value),
      },
    });

    await this.prisma.user.update({
      where: { id: fromUser.id },
      data: {
        balance:
          data.type === TransactionType.DEPOSIT
            ? (fromUser.balance -= data.value)
            : (fromUser.balance += data.value),
      },
    });
  }

  async findOne(id: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found.');
      }

      return transaction;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return this.prisma.transaction.findMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, data: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    try {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          from: data.from,
          to: data.to,
          type: data.type,
          value: data.value,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: string) {
    const transaction = await this.findOne(id);

    try {
      await this.prisma.transaction.delete({ where: { id: transaction.id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
