import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const data = await this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.tokenPayload = data;

      request.user = await this.userService.getById(data.id);

      return true;
    } catch (e) {
      return false;
    }
  }
}
