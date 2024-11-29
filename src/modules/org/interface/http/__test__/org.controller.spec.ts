import { Test, TestingModule } from '@nestjs/testing';
import { OrgController } from '../org.controller';
import { OrgRepository } from '../../../application/ports/org.repository';
import { OrgService } from '../../../application/services/org.service';

describe('OrgController', () => {
  let controller: OrgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgController],
      providers: [OrgService, OrgRepository],
    }).compile();

    controller = module.get<OrgController>(OrgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
