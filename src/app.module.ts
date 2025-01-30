import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

import { envSchema } from '@/infra/env/env';
import { HttpModule } from '@/interface/http/http.module';

import { EnvModule } from './infra/env/env.module';
import { SocketIoClientModule } from './infra/socket/socket.module';

@Module (
  {
    imports:
    [
      ConfigModule.forRoot({
        validate: (env) => envSchema.parse(env),
        isGlobal: true,
        cache: true,
      }),
      I18nModule.forRootAsync({
        useFactory: () => 
{
          const isProd = process.env.NODE_ENV === 'production';
          return {
            fallbackLanguage: 'es',
            loaderOptions: {
              path: path.join(__dirname, isProd ? '/src/interface/i18n/' : '/interface/i18n/'),
              watch: !isProd, // Evita el watch en producción si no es necesario
            },
            typesOutputPath: path.join(__dirname, '../../src/infra/generated/i18n.generated.ts'),
          };
        },
        resolvers: [
          { use: QueryResolver, options: ['lang'] },
          AcceptLanguageResolver,
          new HeaderResolver(['x-lang']),
        ],
      }),
      EnvModule,
      SocketIoClientModule,
      HttpModule,
    ]
  }
)
export class AppModule
{}
