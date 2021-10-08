import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CrowdinCredentialsService } from '../service/crowdin-credentials.service';
import manifest from '../config/manifest';
import { CrowdinContextGuard } from '../guard/crowdin-context.guard';
import { IntegrationCredentialsService } from '../service/integration-credentials.service';
import { CrowdinContext } from '../decorator/crowdin-context.decorator';
import { InstallEvent, UninstallEvent } from '@crowdin/crowdin-apps-functions';
import { CrowdinContextInfo } from '../model/crowdin/crowdin-context-info';

@Controller()
export class AppController {
  constructor(
    private crowdinCredentialsService: CrowdinCredentialsService,
    private integrationCredentialsService: IntegrationCredentialsService,
  ) {}

  @Post('installed')
  @HttpCode(204)
  installed(@Body() event: InstallEvent): Promise<void> {
    return this.crowdinCredentialsService.installApp(event);
  }

  @Post('uninstall')
  @HttpCode(204)
  uninstall(@Body() event: UninstallEvent): Promise<void> {
    return this.crowdinCredentialsService.uninstallApp(event);
  }

  @Get('manifest.json')
  manifest(): any {
    return manifest;
  }

  @Get()
  @UseGuards(CrowdinContextGuard)
  async main(
    @CrowdinContext() context: CrowdinContextInfo,
    @Res() res: Response,
  ) {
    const installed = await this.crowdinCredentialsService.exists(
      context.crowdinId,
    );
    const loggedIn = await this.integrationCredentialsService.exists(
      context.clientId,
    );
    const options = {
      name: manifest.name,
    };
    let view = 'main';
    if (!installed) {
      view = 'install';
    } else if (!loggedIn) {
      view = 'login';
    }
    return res.render(view, options);
  }
}
