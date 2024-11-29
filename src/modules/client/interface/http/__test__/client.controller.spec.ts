import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '@/modules/client/application/services/client.service';
import { ClientRepository } from '@/modules/client/application/ports/client.repository';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule],
      controllers: [ClientController],
      providers: [ClientService, ClientRepository, ConfigService],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
