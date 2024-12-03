import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import {
  ClientResponseSwagger,
  PaginatedClientSwaggerModel,
} from './dtos/client-response.swagger';
import { CommonPaginationDto } from '@/shared/interface/http/dtos/common-pagination.dto';
import { ClientService } from '@/modules/client/application/services/client.service';
import { CreateClientDto, UpdateClientDto } from './dtos/client.dto';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';

@Controller('clients')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-modules-key')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ClientResponseSwagger.GetClientList()
  index(
    @Query() queries: CommonPaginationDto,
  ): Promise<PaginatedClientSwaggerModel> {
    return this.clientService.findAllClientsWithPagination(queries);
  }

  @Get(':id')
  @ClientResponseSwagger.GetClientById()
  async show(@Param('id') id: string): Promise<ClientResponseSwagger> {
    try {
      return await this.clientService.findById(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post()
  @ClientResponseSwagger.CreateClient()
  async create(
    @Body() payload: CreateClientDto,
  ): Promise<ClientResponseSwagger> {
    try {
      return this.clientService.createClient(payload);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Patch(':id')
  @ClientResponseSwagger.UpdateClient()
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateClientDto,
  ): Promise<ClientResponseSwagger> {
    try {
      return this.clientService.updateClient(id, payload);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  @ClientResponseSwagger.DeleteClient()
  async destroy(@Param('id') id: string): Promise<ClientResponseSwagger> {
    try {
      return this.clientService.deleteClientById(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
