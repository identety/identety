import { Test } from '@nestjs/testing';
import { OauthService } from '../../services/oauth.service';
import { OauthRepository } from '../../ports/oauth.repository';

describe('OauthService', () => {
  let service: OauthService;
  let repository: OauthRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OauthService, OauthRepository],
    }).compile();

    service = module.get(OauthService);
    repository = module.get(OauthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
