import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/guards/AdminGuard';
import { ClientService } from '@/api/client/client.service';
import { CreateClientDto } from '@/api/client/dtos/client.dto';
import { ClientResponseDomainDto } from '@/common/domain/models/client';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('clients')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(
    @Body() payload: CreateClientDto,
  ): Promise<ClientResponseDomainDto> {
    try {
      return this.clientService.create(payload);
    } catch (e) {
      throw e;
    }
  }
}
