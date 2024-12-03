import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserRepository } from '../../../application/ports/user.repository';
import { UserService } from '../../../application/services/user.service';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from '@/shared/infrastructure/persistence/persistence.module';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), PersistenceModule],
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
