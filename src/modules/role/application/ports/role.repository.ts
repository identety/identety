import { PersistentRepository } from '@/shared/infrastructure/persistence/persistentRepository';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { DatabaseTableName } from '@/shared/infrastructure/persistence/persistence.contract';
import { Role } from '@/modules/role/domain/models/role';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository extends PersistentRepository<Role> {
  constructor(
    public readonly persistentDriverService: PersistentDriverService<Role>,
  ) {
    super(DatabaseTableName.roles, persistentDriverService);
  }
}
