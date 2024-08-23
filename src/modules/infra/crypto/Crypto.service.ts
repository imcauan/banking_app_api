import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly salt: number = 10;

  async hash(pass: string): Promise<string> {
    return bcrypt.hash(pass, this.salt);
  }

  async compare(pass: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pass, hash);
  }
}
