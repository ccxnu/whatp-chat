import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import * as path from 'path';

export const SwaggerSetting = (app: INestApplication) =>
{
  const swaggerConfig = readFileSync(path.join(__dirname, '../../../../public/swagger.json'), 'utf8');
  const swaggerDocument = JSON.parse(swaggerConfig);

  swaggerDocument.servers.at(0).url = 'http://localhost:3000/api';
  swaggerDocument.servers.at(0).description = 'Server';

  SwaggerModule.setup('api/docs', app, swaggerDocument);
};
