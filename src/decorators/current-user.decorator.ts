import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserContext = (ctx: ExecutionContext) => {
  const type = ctx.getType();
  if (type === 'http') {
    return ctx.switchToHttp().getRequest().user;
  }
  if (type === 'rpc') {
    return ctx.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserContext(ctx),
);
