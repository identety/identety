import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ClientModule } from '@/modules/client/client.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/modules/user/user.module';
import { OrgModule } from '@/modules/org/org.module';
import { RoleModule } from '@/modules/role/role.module';
import { TestHelperModule } from './shared/test-helper/test-helper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    //
    ClientModule,
    UserModule,
    OrgModule,
    RoleModule,
    TestHelperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
