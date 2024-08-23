import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  async sign<T extends object | Buffer>(
    payload: T,
    expiresIn: string | number = '1d',
  ): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn });
  }

  async verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verify<T>(token);
  }
}
