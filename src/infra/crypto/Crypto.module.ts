import { Module } from '@nestjs/common';
import { CryptoService } from './Crypto.service';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
