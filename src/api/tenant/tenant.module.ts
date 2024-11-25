import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { ClientModule } from './client/client.module';
import { Oauth2Module } from './oauth2/oauth2.module';
import { OidcModule } from './oidc/oidc.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [TenantService],
  controllers: [TenantController],
  imports: [ClientModule, Oauth2Module, OidcModule, AuthModule]
})
export class TenantModule {}
