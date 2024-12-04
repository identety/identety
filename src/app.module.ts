import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ClientModule } from '@/modules/client/client.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/modules/user/user.module';
import { OrgModule } from '@/modules/org/org.module';
import { RoleModule } from '@/modules/role/role.module';
import { TEST_ENV } from '@/shared/test-helper/test.env';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: process.env.NODE_ENV === 'test',
      // load: [() => TEST_ENV],
    }),

    //
    ClientModule,
    UserModule,
    OrgModule,
    RoleModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
