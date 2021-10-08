import { Injectable } from '@nestjs/common';
import Crowdin, { SourceFilesModel } from '@crowdin/crowdin-api-client';
import {
  getFolder,
  getOrCreateFolder,
  updateOrCreateFile,
} from '@crowdin/crowdin-apps-functions';
import { IntegrationFile } from '../model/integration/integration-file';
import FileType = SourceFilesModel.FileType;
import axios from 'axios';

@Injectable()
export class IntegrationService {
  private readonly crowdinRootFolder = 'Integration';

  async checkConnection(apiKey: string): Promise<void> {
    //here you need to check if API token for integration service is valid
  }

  async getCrowdinFiles(
    client: Crowdin,
    projectId: number,
  ): Promise<SourceFilesModel.File[]> {
    //here you need to load files which are associated with your integration files
    const directories = await client.sourceFilesApi
      .withFetchAll()
      .listProjectDirectories(projectId);
    const { files } = await getFolder(
      directories.data.map((d) => d.data),
      client,
      projectId,
      this.crowdinRootFolder,
    );
    return files;
  }

  async getIntegrationFiles(apiKey: string): Promise<IntegrationFile[]> {
    //here you need to fetch files/objects from integration
    return [
      {
        id: 'test',
        name: 'File from integration',
        type: 'json',
      },
    ];
  }

  async crowdinUpdate(
    crowdinClient: Crowdin,
    projectId: number,
    data: any,
  ): Promise<void> {
    //here you need to get data from integration and upload it to Crowdin
    const directories = await crowdinClient.sourceFilesApi
      .withFetchAll()
      .listProjectDirectories(projectId);
    const { folder, files } = await getOrCreateFolder(
      directories.data.map((d) => d.data),
      crowdinClient,
      projectId,
      this.crowdinRootFolder,
    );
    const fileContent = {
      title: 'Hello World',
    };
    await updateOrCreateFile(
      crowdinClient,
      projectId,
      'integration.json',
      'Sample file from integration',
      FileType.JSON,
      folder.id,
      fileContent,
      files.find((f) => f.name === 'integration.json'),
    );
  }

  async updateIntegration(
    crowdinClient: Crowdin,
    projectId: number,
    apiToken: string,
    data: any,
  ): Promise<void> {
    //here should be logic to get translations from Crowdin and upload them to integration
    const directories = await crowdinClient.sourceFilesApi
      .withFetchAll()
      .listProjectDirectories(projectId);
    const { files } = await getFolder(
      directories.data.map((d) => d.data),
      crowdinClient,
      projectId,
      this.crowdinRootFolder,
    );
    const file = files.find((f) => f.name === 'integration.json');
    if (file) {
      const translationsLink =
        await crowdinClient.translationsApi.buildProjectFileTranslation(
          projectId,
          file.id,
          { targetLanguageId: 'uk' },
        );
      if (!translationsLink) {
        return;
      }
      const response = (await axios.get(translationsLink.data.url)) as any;
      console.log(response.data);
    }
  }
}
