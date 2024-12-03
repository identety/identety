import { PersistentRepository } from '@/shared/infrastructure/persistence/persistentRepository';
import { User } from '@/modules/user/domain/models/user';
import { PersistentDriverService } from '@/shared/infrastructure/persistence/persistent-driver.service';
import { DatabaseTableName } from '@/shared/infrastructure/persistence/drizzle/schemas';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends PersistentRepository<User> {
  constructor(
    public readonly persistentDriverService: PersistentDriverService<User>,
  ) {
    super(DatabaseTableName.users, persistentDriverService);
  }
}
