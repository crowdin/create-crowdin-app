import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrowdinCredentials } from '../entity/crowdin-credentials';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';
import Crowdin from '@crowdin/crowdin-api-client';
import {
  generateOAuthToken,
  InstallEvent,
  refreshOAuthToken,
  UninstallEvent,
} from '@crowdin/crowdin-apps-functions';

@Injectable()
export class CrowdinCredentialsService {
  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
    @InjectRepository(CrowdinCredentials)
    private repository: Repository<CrowdinCredentials>,
  ) {}

  async exists(id: string): Promise<boolean> {
    const record = await this.repository.findOne(id);
    return !!record;
  }

  find(id: string): Promise<CrowdinCredentials | undefined> {
    return this.repository.findOne(id);
  }

  async installApp(event: InstallEvent): Promise<void> {
    const token = await generateOAuthToken(
      this.configService.get('crowdinClientId'),
      this.configService.get('crowdinClientSecret'),
      event.code,
    );
    const credentials: CrowdinCredentials = {
      id: (event.domain || event.organizationId).toString(),
      accessToken: this.cryptoService.encryptData(token.accessToken),
      refreshToken: this.cryptoService.encryptData(token.refreshToken),
      expire: (new Date().getTime() / 1000 + token.expiresIn).toString(),
    };
    await this.repository.save(credentials);
  }

  async uninstallApp(event: UninstallEvent): Promise<void> {
    await this.repository.delete(
      (event.domain || event.organizationId).toString(),
    );
  }

  async initializeClient(id: string, domain?: string): Promise<Crowdin> {
    const credentials = await this.find(id);
    if (!credentials) {
      throw new Error("Can't find organization by id");
    }
    const isExpired = +credentials.expire < +new Date().getTime() / 1000;
    if (!isExpired) {
      const crowdinToken = this.cryptoService.decryptData(
        credentials.accessToken,
      );
      return new Crowdin({
        token: crowdinToken,
        organization: domain ? credentials.id : undefined,
      });
    } else {
      const newCredentials = await refreshOAuthToken(
        this.configService.get('crowdinClientId'),
        this.configService.get('crowdinClientSecret'),
        this.cryptoService.decryptData(credentials.refreshToken),
      );
      await this.repository.save({
        id,
        refreshToken: this.cryptoService.encryptData(
          newCredentials.refreshToken,
        ),
        accessToken: this.cryptoService.encryptData(newCredentials.accessToken),
        expire: (
          new Date().getTime() / 1000 +
          newCredentials.expiresIn
        ).toString(),
      } as CrowdinCredentials);
      return new Crowdin({
        token: newCredentials.accessToken,
        organization: domain ? credentials.id : undefined,
      });
    }
  }
}
