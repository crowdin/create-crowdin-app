import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoService } from './crypto.service';
import { IntegrationCredentials } from '../entity/integration-credentials';

@Injectable()
export class IntegrationCredentialsService {
  constructor(
    private cryptoService: CryptoService,
    @InjectRepository(IntegrationCredentials)
    private repository: Repository<IntegrationCredentials>,
  ) {}

  async exists(id: string): Promise<boolean> {
    const record = await this.repository.findOne(id);
    return !!record;
  }

  async getApiKey(id: string): Promise<string> {
    const credentials = await this.repository.findOne(id);
    return this.cryptoService.decryptData(credentials.apiKey);
  }

  save(
    id: string,
    apiKey: string,
    crowdinId: string,
  ): Promise<IntegrationCredentials> {
    return this.repository.save({
      id,
      apiKey: this.cryptoService.encryptData(apiKey),
      crowdinId,
    } as IntegrationCredentials);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
