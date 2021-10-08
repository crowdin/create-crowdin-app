import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CrowdinClient = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.crowdinApiClient;
  },
);
