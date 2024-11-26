import { Controller, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/guards/AdminGuard';

@Controller('clients')
@UseGuards(AdminAuthGuard)
export class ClientController {
  constructor() {}
}
