import { PersistentRepository } from '@/shared/infrastructure/persistence/persistentRepository';
import { Client } from '@/modules/client/domain/models/client';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { Injectable } from '@nestjs/common';
import { DatabaseTableName } from '@/shared/infrastructure/persistence/persistence.contract';

@Injectable()
export class ClientRepository extends PersistentRepository<Client> {
  constructor(
    public readonly persistentDriver: PersistentDriverService<Client>,
  ) {
    super(DatabaseTableName.clients, persistentDriver);
  }
}
