import { Controller, Get } from '@nestjs/common';
import * as util from '@crowdin/crowdin-apps-functions';

@Controller()
export class AppController {
  @Get()
  test(): string {
    return util.constructCrowdinIdFromJwtPayload({
      context: {
        project_id: 1,
        organization_id: 2,
        user_id: 3,
      },
      domain: 'test1',
      aud: 'one',
      exp: Date.now(),
      iat: Date.now(),
      sub: 'test2',
    });
  }
}
