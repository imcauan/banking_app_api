import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../../infra/prisma/Prisma.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { JwtService } from '../../infra/jwt/Jwt.service';
import { CryptoService } from '../../infra/crypto/Crypto.service';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { AuthPayloadDto } from '../../infra/jwt/dtos/auth-payload.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly PrismaClient: PrismaService,
    private readonly JWTService: JwtService,
    private readonly CryptoService: CryptoService,
    private readonly userService: UserService,
  ) {}

  async register(image: Express.Multer.File, data: AuthRegisterDto) {
    if (
      (await this.PrismaClient.user.count({
        where: { email: data.email },
      })) > 0
    ) {
      throw new ConflictException('A user with this email already exists!');
    }

    await this.userService.create(image, data);

    return this.login({ email: data.email, password: data.password });
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
