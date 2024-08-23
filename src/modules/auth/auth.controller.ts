import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@User() user) {
    return user;
  }
}
