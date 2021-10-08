import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IntegrationCredentialsService } from '../service/integration-credentials.service';

@Injectable()
export class IntegrationContextGuard implements CanActivate {
  constructor(
    private integrationCredentialsService: IntegrationCredentialsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientId = request.crowdinContext?.clientId;
    if (!clientId) {
      return false;
    }
    const exists = await this.integrationCredentialsService.exists(clientId);
    if (!exists) {
      return false;
    }
    request.integrationApiKey =
      await this.integrationCredentialsService.getApiKey(clientId);
    return true;
  }
}
