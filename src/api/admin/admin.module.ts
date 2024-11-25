import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [TenantModule]
})
export class AdminModule {}
