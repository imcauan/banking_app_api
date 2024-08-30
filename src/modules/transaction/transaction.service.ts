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

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(data: CreateTransactionDto): Promise<void> {
    const receiverUser = await this.userService.findOne(data.from);
    const senderUser = await this.prisma.user.findFirst({
      where: { email: data.to },
    });

    if (data.value > receiverUser.balance) {
      throw new ForbiddenException(
        'The value cannot be bigger than your balance.',
      );
    }

    await this.prisma.transaction.create({
      data: {
        senderId: receiverUser.id,
        receiverId: senderUser.id,
        type: 1,
        value: data.value,
      },
    });

    await this.prisma.user.update({
      where: { id: receiverUser.id },
      data: {
        balance: (receiverUser.balance -= data.value),
      },
    });

    await this.prisma.user.update({
      where: { id: senderUser.id },
      data: {
        balance: (senderUser.balance += data.value),
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

  async getUserTransactions(id: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({
        include: {
          sender: true,
          receiver: true,
        },
      });

      for (const transaction of transactions) {
        if (transaction.senderId !== id && transaction.receiverId !== id) {
          throw new ForbiddenException(
            'You are not allowed to see this transaction.',
          );
        }
      }

      return transactions;
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
          senderId: data.from,
          receiverId: data.to,
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
