import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json as bodyParserJoin } from 'body-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParserJoin({ limit: '16mb' }));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  await app.listen(config.port);
}
bootstrap();
