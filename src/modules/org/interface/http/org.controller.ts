import { Controller, Get, Param } from '@nestjs/common';
import { OrgService } from '../../application/services/org.service';

@Controller('org')
export class OrgController {
  constructor(private readonly service: OrgService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<string> {
    return this.service.findById(id);
  }
}
