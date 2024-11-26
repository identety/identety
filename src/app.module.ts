import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';

import { OauthModule } from './api/oauth/oauth.module';
import { OidcModule } from './api/oidc/oidc.module';
import { ClientModule } from './api/client/client.module';
import { OrgModule } from './api/org/org.module';
import { RoleModule } from './api/role/role.module';

@Module({
  imports: [
    CommonModule,
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
