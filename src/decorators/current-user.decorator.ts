import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const getCurrentUserContext = (context: ExecutionContext) => {
  const type = context.getType();
  if (type === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (type === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserContext(context),
);
