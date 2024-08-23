import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateCardDto } from './dtos/create-card-dto';
import { PrismaService } from 'src/infra/prisma/Prisma.service';
import { UpdateCardDto } from './dtos/update-card.dto';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCardDto) {
    if (
      (await this.prisma.cards.count({ where: { number: data.number } })) > 0
    ) {
      throw new ConflictException('Card already exists!');
    }

    try {
      await this.prisma.cards.create({
        data: {
          number: data.number,
          cvv: data.cvv,
          type: data.type,
          flag: data.flag,
          owner_id: data.owner_id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      return this.prisma.cards.findUnique({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      return this.prisma.cards.findMany();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, data: UpdateCardDto) {
    const card = await this.findOne(id);

    try {
      await this.prisma.cards.update({ where: { id: card.id }, data });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: string) {
    const card = await this.findOne(id);

    try {
      await this.prisma.cards.delete({ where: { id: card.id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async exists(number: number): Promise<boolean> {
    if ((await this.prisma.cards.count({ where: { number } })) > 0) {
      return true;
    }

    return false;
  }
}
