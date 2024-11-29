import { Test } from '@nestjs/testing';
import { OrgService } from '../../services/org.service';
import { OrgRepository } from '../../ports/org.repository';

describe('OrgService', () => {
  let service: OrgService;
  let repository: OrgRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrgService, OrgRepository],
    }).compile();

    service = module.get(OrgService);
    repository = module.get(OrgRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
