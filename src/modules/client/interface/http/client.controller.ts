import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { ClientService } from '@/modules/client/application/services/client.service';
import {
  ClientListQueryDto,
  CreateClientDto,
  UpdateClientDto,
} from './dtos/client.dto';
import { AdminAuthGuard } from '@/shared/interface/http/security/guards/AdminGuard';
import { BaseHTTPController } from '@/shared/interface/http/baseHTTPController';

@Controller('clients')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class ClientController extends BaseHTTPController {
  constructor(private readonly clientService: ClientService) {
    super();
  }

  @Get()
  @ClientResponseSwagger.GetClientList()
  index(
    @Query() queries: ClientListQueryDto,
  ): Promise<PaginatedClientSwaggerModel> {
    return this.execute(() =>
      this.clientService.findAllClientsWithPagination(queries),
    );
  }

  @Get(':id')
  @ClientResponseSwagger.GetClientById()
  async show(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClientResponseSwagger> {
    return this.execute(() => this.clientService.findById(id));
  }

  @Post()
  @ClientResponseSwagger.CreateClient()
  async create(
    @Body() payload: CreateClientDto,
  ): Promise<ClientResponseSwagger> {
    return this.execute(() => this.clientService.createClient(payload));
  }

  @Patch(':id')
  @ClientResponseSwagger.UpdateClient()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateClientDto,
  ): Promise<ClientResponseSwagger> {
    return this.execute(() => this.clientService.updateClient(id, payload));
  }

  @Delete(':id')
  @ClientResponseSwagger.DeleteClient()
  async destroy(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ClientResponseSwagger> {
    return this.execute(() => this.clientService.deleteClientById(id));
  }
}
