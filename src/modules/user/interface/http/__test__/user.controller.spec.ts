import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserRepository } from '../../../application/ports/user.repository';
import { UserService } from '../../../application/services/user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
