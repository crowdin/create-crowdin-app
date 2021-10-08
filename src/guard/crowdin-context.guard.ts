import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrowdinContextInfo } from '../model/crowdin/crowdin-context-info';
import {
  constructCrowdinIdFromJwtPayload,
  validateJwtToken,
} from '@crowdin/crowdin-apps-functions';

@Injectable()
export class CrowdinContextGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const origin = request.query.origin;
    const clientId = request.query.client_id;
    const tokenJwt = request.query.tokenJwt;
    if (
      !origin ||
      !clientId ||
      !tokenJwt ||
      clientId !== this.configService.get('crowdinClientId')
    ) {
      throw new HttpException('No origin', HttpStatus.UNAUTHORIZED);
    }
    try {
      const jwtPayload = await validateJwtToken(
        tokenJwt,
        this.configService.get('crowdinClientSecret'),
      );
      request.crowdinContext = {
        jwtPayload,
        clientId: constructCrowdinIdFromJwtPayload(jwtPayload),
        crowdinId: `${jwtPayload.domain || jwtPayload.context.organization_id}`,
      } as CrowdinContextInfo;
    } catch (e) {
      throw new HttpException("Can't verify", HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
