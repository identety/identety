import { Test } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { UserRepository } from '../../ports/user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get(UserService);
    repository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
