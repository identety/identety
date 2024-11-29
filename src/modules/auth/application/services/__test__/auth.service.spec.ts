import { Test } from '@nestjs/testing';
import { AuthService } from '../../services/auth.service';
import { AuthRepository } from '../../ports/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, AuthRepository],
    }).compile();

    service = module.get(AuthService);
    repository = module.get(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
