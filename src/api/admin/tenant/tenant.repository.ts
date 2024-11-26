import { PersistentRepository } from '../../../common/persistence/persistentRepository';
import { Tenant } from '../../../common/domain/models/domain-models';
import { PersistentDriverService } from '../../../common/persistence/persistent-driver.service';
import { DatabaseTableName } from '../../../common/persistence/drizzle/schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantRepository extends PersistentRepository<Tenant> {
  constructor(
    public readonly persistentDriver: PersistentDriverService<Tenant>,
  ) {
    super(DatabaseTableName.tenants, persistentDriver);
  }
}
