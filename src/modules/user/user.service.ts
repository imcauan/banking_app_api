import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from 'src/infra/prisma/Prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { TransactionService } from '../transaction/transaction.service';
import { CreateTransactionDto } from '../transaction/dtos/create-transaction.dto';
import { FileService } from '../file/file.service';
import { CryptoService } from 'src/infra/crypto/Crypto.service';
import { CreateCardDto } from '../card/dtos/create-card-dto';
import { CardService } from '../card/card.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly transactionService: TransactionService,
    private readonly fileService: FileService,
    private readonly cardService: CardService,
  ) {}

  async create(image: Express.Multer.File, data: CreateUserDto) {
    if ((await this.prisma.user.count({ where: { email: data.email } })) > 0) {
      throw new ForbiddenException('User already exists!');
    }

    const hashedPassword = await this.cryptoService.hash(data.password);

    try {
      await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          image: image.filename,
          password: hashedPassword,
          balance: 0,
          cards: {
            create: [],
          },
        },
      });

      this.fileService.uploadPhoto(image);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: string) {
    const user = await this.findOne(id);

    try {
      await this.prisma.user.delete({ where: { id: user.id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async newTransaction(data: CreateTransactionDto) {
    await this.transactionService.create(data);
  }

  async newCard(data: CreateCardDto) {
    if (this.cardService.exists(data.number)) {
      throw new ConflictException('Card already exists.');
    }

    await this.cardService.create(data);
  }
}
