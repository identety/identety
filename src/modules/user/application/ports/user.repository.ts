import { PersistentRepository } from '@/shared/infrastructure/persistence/persistentRepository';
import { User } from '@/modules/user/domain/models/user';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { Injectable } from '@nestjs/common';
import { DatabaseTableName } from '@/shared/infrastructure/persistence/persistence.contract';

@Injectable()
export class UserRepository extends PersistentRepository<User> {
  constructor(
    public readonly persistentDriverService: PersistentDriverService<User>,
  ) {
    super(DatabaseTableName.users, persistentDriverService);
  }
}
