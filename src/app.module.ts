import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ClientModule } from '@/modules/client/client.module';

import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/modules/user/user.module';
import { OrgModule } from '@/modules/org/org.module';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
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
