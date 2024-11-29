import { Module } from '@nestjs/common';
import { OauthController } from './interface/http/oauth.controller';
import { OauthService } from './application/services/oauth.service';
import { OauthRepository } from './application/ports/oauth.repository';

@Module({
  controllers: [OauthController],
  providers: [OauthService, OauthRepository],
})
export class OauthModule {}
