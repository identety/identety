import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<string> {
    return this.service.findById(id);
  }
}
