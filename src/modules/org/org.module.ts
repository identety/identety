import { Module } from '@nestjs/common';
import { OrgController } from './interface/http/org.controller';
import { OrgService } from './application/services/org.service';
import { OrgRepository } from './application/ports/org.repository';

@Module({
  controllers: [OrgController],
  providers: [OrgService, OrgRepository],
})
export class OrgModule {}
