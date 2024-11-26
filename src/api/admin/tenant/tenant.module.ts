import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantRepository } from './tenant.repository';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
})
export class TenantModule {}
