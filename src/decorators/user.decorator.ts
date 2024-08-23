import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException(
        "Request user not found, maybe you're forgetting of AuthGuard.",
      );
    }

    return request.user;
  },
);
