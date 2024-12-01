import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
