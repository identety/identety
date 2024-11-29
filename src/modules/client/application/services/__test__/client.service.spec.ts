import { ClientService } from '@/modules/client/application/services/client.service';
import { Test } from '@nestjs/testing';
import { ClientRepository } from '@/modules/client/application/ports/client.repository';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';
import { ClientController } from '@/modules/client/interface/http/client.controller';
import { ConfigModule } from '@nestjs/config';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule],
      providers: [ClientService, ClientRepository],
      controllers: [ClientController],
    }).compile();

    service = module.get(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
