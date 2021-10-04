import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import Crowdin, {
  ProjectsGroupsModel,
  SourceFilesModel,
} from '@crowdin/crowdin-api-client';
import { IntegrationCredentialsService } from '../service/integration-credentials.service';
import { IntegrationLogin } from '../model/integration/integration-login';
import { CrowdinContextGuard } from '../guard/crowdin-context.guard';
import { CrowdinContextInfo } from '../model/crowdin/crowdin-context-info';
import { CrowdinContext } from '../decorator/crowdin-context.decorator';
import { CrowdinClient } from '../decorator/crowdin-client.decorator';
import { IntegrationService } from '../service/integration.service';
import { CrowdinClientGuard } from '../guard/crowdin-client.guard';
import { IntegrationContextGuard } from '../guard/integration-context.guard';
import { IntegrationApiKey } from '../decorator/integration-api-key.decorator';
import { FileProgress } from '../model/crowdin/file-progress';
import { IntegrationFile } from '../model/integration/integration-file';

@Controller('api')
export class IntegrationController {
  constructor(
    private integrationCredentialsService: IntegrationCredentialsService,
    private integrationService: IntegrationService,
  ) {}

  @Post('login')
  @HttpCode(204)
  @UseGuards(CrowdinContextGuard)
  async login(
    @CrowdinContext() context: CrowdinContextInfo,
    @Body() loginRequest: IntegrationLogin,
  ): Promise<void> {
    await this.integrationService.checkConnection(loginRequest.apiKey);
    await this.integrationCredentialsService.save(
      context.clientId,
      loginRequest.apiKey,
      context.crowdinId,
    );
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(CrowdinContextGuard)
  async logout(@CrowdinContext() context: CrowdinContextInfo): Promise<void> {
    await this.integrationCredentialsService.delete(context.clientId);
  }

  @Get('crowdin/files')
  @UseGuards(CrowdinClientGuard)
  async crowdinFiles(
    @CrowdinClient() crowdinClient: Crowdin,
    @CrowdinContext() context: CrowdinContextInfo,
  ): Promise<SourceFilesModel.File[]> {
    return this.integrationService.getCrowdinFiles(
      crowdinClient,
      context.jwtPayload.context.project_id,
    );
  }

  @Get('crowdin/project')
  @UseGuards(CrowdinClientGuard)
  async crowdinProject(
    @CrowdinClient() crowdinClient: Crowdin,
    @CrowdinContext() context: CrowdinContextInfo,
  ): Promise<ProjectsGroupsModel.Project> {
    const project = await crowdinClient.projectsGroupsApi.getProject(
      context.jwtPayload.context.project_id,
    );
    return project.data;
  }

  @Get('crowdin/file-progress/:fileId')
  @UseGuards(CrowdinClientGuard)
  async crowdinFileProgress(
    @CrowdinClient() crowdinClient: Crowdin,
    @CrowdinContext() context: CrowdinContextInfo,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<FileProgress> {
    const progress = await crowdinClient.translationStatusApi.getFileProgress(
      context.jwtPayload.context.project_id,
      fileId,
    );
    return { [fileId]: progress.data.map((e) => e.data) };
  }

  @Get('integration/data')
  @UseGuards(CrowdinContextGuard, IntegrationContextGuard)
  async integrationFiles(
    @IntegrationApiKey() apiKey: string,
  ): Promise<IntegrationFile[]> {
    return this.integrationService.getIntegrationFiles(apiKey);
  }

  @Post('crowdin/update')
  @HttpCode(204)
  @UseGuards(CrowdinClientGuard)
  crowdinUpdate(
    @CrowdinClient() crowdinClient: Crowdin,
    @CrowdinContext() context: CrowdinContextInfo,
    @Body() req: any,
  ): Promise<void> {
    return this.integrationService.crowdinUpdate(
      crowdinClient,
      context.jwtPayload.context.project_id,
      req,
    );
  }

  @Post('integration/update')
  @HttpCode(204)
  @UseGuards(CrowdinClientGuard, IntegrationContextGuard)
  integrationUpdate(
    @CrowdinClient() crowdinClient: Crowdin,
    @CrowdinContext() context: CrowdinContextInfo,
    @IntegrationApiKey() apiKey: string,
    @Body() request: any,
  ): Promise<void> {
    return this.integrationService.updateIntegration(
      crowdinClient,
      context.jwtPayload.context.project_id,
      apiKey,
      request,
    );
  }
}
