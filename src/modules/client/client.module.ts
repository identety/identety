import { Module } from '@nestjs/common';
import { ClientService } from './application/services/client.service';
import { ClientController } from './interface/http/client.controller';
import { ClientRepository } from '@/modules/client/application/ports/client.repository';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
})
export class ClientModule {}
