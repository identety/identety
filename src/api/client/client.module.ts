import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientRepository } from '@/api/client/client.repository';
import { PersistenceModule } from '@/common/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
})
export class ClientModule {}
