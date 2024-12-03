import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../client.controller';
import { ClientService } from '@/modules/client/application/services/client.service';
import { ClientRepository } from '@/modules/client/application/ports/client.repository';
import { ConfigService } from '@nestjs/config';
import { TestHelperModule } from '@/shared/test-helper/test-helper.module';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestHelperModule],
      controllers: [ClientController],
      providers: [ClientService, ClientRepository, ConfigService],
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
