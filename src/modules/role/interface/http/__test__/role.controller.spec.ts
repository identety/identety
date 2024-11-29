import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from '../role.controller';
import { RoleRepository } from '../../../application/ports/role.repository';
import { RoleService } from '../../../application/services/role.service';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService, RoleRepository],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
