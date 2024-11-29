import { Test, TestingModule } from '@nestjs/testing';
import { OauthController } from '../oauth.controller';
import { OauthRepository } from '../../../application/ports/oauth.repository';
import { OauthService } from '../../../application/services/oauth.service';

describe('OauthController', () => {
  let controller: OauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthController],
      providers: [OauthService, OauthRepository],
    }).compile();

    controller = module.get<OauthController>(OauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
