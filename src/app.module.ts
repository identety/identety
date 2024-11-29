import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OauthModule } from '@/modules/oauth/oauth.module';
import { OidcModule } from '@/modules/oidc/oidc.module';
import { ClientModule } from '@/modules/client/client.module';
import { OrgModule } from '@/modules/org/org.module';
import { RoleModule } from '@/modules/role/role.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    //
    OauthModule,
    OidcModule,
    ClientModule,
    OrgModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
