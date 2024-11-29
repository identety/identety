import { Controller, Get, Param } from '@nestjs/common';
import { OauthService } from '../../application/services/oauth.service';

@Controller('oauth')
export class OauthController {
  constructor(private readonly service: OauthService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<string> {
    return this.service.findById(id);
  }
}
