import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm-config';
import { CrowdinCredentials } from './entity/crowdin-credentials';
import { CrowdinCredentialsService } from './service/crowdin-credentials.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CryptoService } from './service/crypto.service';
import { CrowdinContextGuard } from './guard/crowdin-context.guard';
import { IntegrationCredentials } from './entity/integration-credentials';
import { IntegrationCredentialsService } from './service/integration-credentials.service';
import { IntegrationController } from './controller/integration.controller';
import { CrowdinClientGuard } from './guard/crowdin-client.guard';
import { IntegrationService } from './service/integration.service';
import { IntegrationContextGuard } from './guard/integration-context.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'resources'),
      serveRoot: '/assets',
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([CrowdinCredentials, IntegrationCredentials]),
  ],
  controllers: [AppController, IntegrationController],
  providers: [
    CrowdinCredentialsService,
    IntegrationCredentialsService,
    CryptoService,
    CrowdinContextGuard,
    CrowdinClientGuard,
    IntegrationService,
    IntegrationContextGuard,
  ],
})
export class AppModule {}
