import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from '../../application/services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<string> {
    return this.service.findById(id);
  }
}
