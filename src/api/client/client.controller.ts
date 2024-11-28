import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '@/common/guards/AdminGuard';
import { ClientService } from '@/api/client/client.service';
import {
  CreateClientDto,
  ClientResponseDto,
} from '@/api/client/dtos/client.dto';
import {
  ClientNotFoundError,
  ClientResponseDomainDto,
} from '@/common/domain/models/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppUnAuthorizedResponse } from '@/common/dtos/AppUnAuthorizedResponse';

@Controller('clients')
@UseGuards(AdminAuthGuard)
@ApiSecurity('x-api-key')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Create new client' })
  @ApiResponse({
    isArray: false,
    status: 200,
    description: 'Client found successfully',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid API key.',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async show(@Param('id') id: string) {
    const client = await this.clientService.findById(id);
    if (!client) {
      throw new NotFoundException();
    }
    return client;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ClientResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. For invalid api key or cloud token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid API key or cloud token',
        error: 'Unauthorized',
      },
    },
  })
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
