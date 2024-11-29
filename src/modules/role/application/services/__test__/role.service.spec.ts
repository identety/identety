import { Test } from '@nestjs/testing';
import { RoleService } from '../../services/role.service';
import { RoleRepository } from '../../ports/role.repository';

describe('RoleService', () => {
  let service: RoleService;
  let repository: RoleRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoleService, RoleRepository],
    }).compile();

    service = module.get(RoleService);
    repository = module.get(RoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
