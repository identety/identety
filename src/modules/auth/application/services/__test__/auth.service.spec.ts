import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthRepository } from '@/modules/auth/application/ports/auth.repository';
import { AuthController } from '@/modules/auth/interface/http/auth.controller';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, AuthRepository],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
