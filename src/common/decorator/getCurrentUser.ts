import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    if (user.id === body.userId) {
      return user.id;
    } else {
      throw new UnauthorizedException();
    }
  },
);
