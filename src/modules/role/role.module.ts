import { Module } from '@nestjs/common';
import { RoleController } from './interface/http/role.controller';
import { RoleService } from './application/services/role.service';
import { RoleRepository } from './application/ports/role.repository';

@Module({
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule {}
