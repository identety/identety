import { Controller, Get } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async index() {
    // return this.tenantService.getAllTenants();
  }
}
