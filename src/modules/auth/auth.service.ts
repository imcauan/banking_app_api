import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../infra/prisma/Prisma.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { JwtService } from '../infra/jwt/Jwt.service';
import { CryptoService } from '../infra/crypto/Crypto.service';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { AuthPayloadDto } from '../infra/jwt/dtos/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaClient: PrismaService,
    private readonly JWTService: JwtService,
    private readonly CryptoService: CryptoService,
  ) {}

  async register(data: AuthRegisterDto) {
    const userByEmail = await this.PrismaClient.user.findFirst({
      where: { email: data.email },
    });

    if (userByEmail) {
      throw new ConflictException('A user with this email already exists!');
    }

    const hashedPassword = await this.CryptoService.hash(data.password);

    const user = await this.PrismaClient.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        balance: 0,
        credit_limit: 0,
        monthly_budget: 0,
        credit_cards: null,
        transactions: null,
      },
    });

    const token = await this.JWTService.sign<AuthPayloadDto>(
      {
        id: user.id,
      },
      '1h',
    );

    return {
      token: token,
    };
  }

  async login(data: AuthLoginDto) {
    const user = await this.PrismaClient.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('Email or password might be wrong');
    }

    const passwordMatches = await this.CryptoService.compare(
      data.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new BadRequestException('Email or password might be wrong');
    }

    const token = await this.JWTService.sign<AuthPayloadDto>(
      {
        id: user.id,
      },
      '1h',
    );

    return {
      token: token,
    };
  }

  checkToken(token: string) {
    try {
      const data = this.JWTService.verify<AuthPayloadDto>(token);

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
