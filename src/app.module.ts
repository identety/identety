import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TenantModule } from './api/tenant/tenant.module';
import { AdminModule } from './api/admin/admin.module';

@Module({
  imports: [CommonModule, TenantModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
