import { PersistentRepository } from '@/common/persistence/persistentRepository';
import { Client } from '@/common/domain/models/client';
import { DatabaseTableName } from '@/common/persistence/drizzle/schemas';
import { PersistentDriverService } from '@/common/persistence/persistent-driver.service';
import { Injectable, Post } from '@nestjs/common';

@Injectable()
export class ClientRepository extends PersistentRepository<Client> {
  constructor(
    public readonly persistentDriver: PersistentDriverService<Client>,
  ) {
    super(DatabaseTableName.clients, persistentDriver);
  }

  @Post()
  async create(
    @Body() payload: CreateClientDomainDto,
  ): Promise<ClientResponseDomainDto> {
    return this.service.create(payload);
  }
}
