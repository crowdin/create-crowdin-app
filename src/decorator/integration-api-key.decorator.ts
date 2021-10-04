import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IntegrationApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.integrationApiKey;
  },
);
