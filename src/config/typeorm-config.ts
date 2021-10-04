import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CreateCrowdinCredentialsTable1627735095898 } from '../migration/1627735095898-CreateCrowdinCredentialsTable';
import { CreateIntegrationCredentialsTable1627887598372 } from '../migration/1627887598372-CreateIntegrationCredentialsTable';
import { join } from 'path';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: join(__dirname, '..', '..', 'data', 'integration.sqlite'),
      migrationsTableName: 'migration',
      autoLoadEntities: true,
      synchronize: false,
      migrations: [
        CreateCrowdinCredentialsTable1627735095898,
        CreateIntegrationCredentialsTable1627887598372,
      ],
      migrationsRun: true,
    };
  }
}
