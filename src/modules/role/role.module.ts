import { Module } from '@nestjs/common';
import { RoleController } from './interface/http/role.controller';
import { RoleService } from './application/services/role.service';
import { RoleRepository } from './application/ports/role.repository';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule {}
