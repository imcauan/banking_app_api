import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './Jwt.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
  ],
  exports: [JwtService],
  providers: [JwtService],
})
export class JwtModule {}
