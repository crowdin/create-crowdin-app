import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CrowdinContextGuard } from './crowdin-context.guard';
import { CrowdinContextInfo } from '../model/crowdin/crowdin-context-info';
import { ConfigService } from '@nestjs/config';
import { CrowdinCredentialsService } from '../service/crowdin-credentials.service';

@Injectable()
export class CrowdinClientGuard extends CrowdinContextGuard {
  private credentialsService: CrowdinCredentialsService;

  constructor(
    configService: ConfigService,
    crowdinCredentialsService: CrowdinCredentialsService,
  ) {
    super(configService);
    this.credentialsService = crowdinCredentialsService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActive = await super.canActivate(context);
    if (canActive) {
      const request = context.switchToHttp().getRequest();
      const crowdinContext = request.crowdinContext as CrowdinContextInfo;
      try {
        request.crowdinApiClient =
          await this.credentialsService.initializeClient(
            crowdinContext.crowdinId,
            crowdinContext.jwtPayload.domain,
          );
        return true;
      } catch (e) {
        throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
      }
    }
    return false;
  }
}
