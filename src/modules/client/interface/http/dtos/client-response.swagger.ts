// src/modules/clients/responses/client.response.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class PrivateClientResponse {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'client_abc123' })
  clientId: string;

  @ApiProperty({ example: 'private' })
  type: string;

  @ApiProperty({ example: ['https://example.com/callback'] })
  redirectUris: string[];

  @ApiProperty({ example: ['openid', 'profile'] })
  allowedScopes: string[];
}

export class M2MClientResponse {
  @ApiProperty({ example: 'uuid-456' })
  id: string;

  @ApiProperty({ example: 'm2m_xyz789' })
  clientId: string;

  @ApiProperty({ example: 'm2m' })
  type: string;

  @ApiProperty({ example: ['read:users', 'write:users'] })
  allowedScopes: string[];
}

export class ClientResponseSwagger {
  static GetClientList() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all clients' }),
      ApiOkResponse({
        description: 'Clients retrieved successfully',
        type: PaginatedClientSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
    );
  }
  static GetClientById() {
    return applyDecorators(
      ApiOperation({ summary: 'Get client details by id' }),
      ApiResponse({
        isArray: false,
        status: 200,
        description: 'Client found successfully',
        type: ClientSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Client not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }
  static UpdateClient() {
    return applyDecorators(
      ApiOperation({ summary: 'Update client' }),
      ApiResponse({
        status: 200,
        description: 'Client updated successfully',
        type: ClientSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Client not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }
  static DeleteClient() {
    return applyDecorators(
      ApiOperation({ summary: 'Delete client' }),
      ApiResponse({
        status: 200,
        description: 'Client deleted successfully',
        type: ClientSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Client not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }
  static CreateClient() {
    return applyDecorators(
      ApiOperation({ summary: 'Create client' }),
      ApiCreatedResponse({
        description: 'Client created successfully.',
        type: ClientSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Client not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }
}

// -----------------------------------------------------------------------------
// Swagger Responses Models (for documentation)
// -----------------------------------------------------------------------------
class ClientSwaggerModel {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'client_abc123' })
  clientId: string;

  @ApiProperty({ example: 'secret_xyz789' })
  clientSecret?: string;

  @ApiProperty({ example: 'My Client' })
  name: string;

  @ApiProperty({ enum: ['public', 'private', 'm2m'] })
  type: string;

  @ApiProperty({ example: ['https://example.com/callback'] })
  redirectUris: string[];

  @ApiProperty({ example: ['openid', 'profile'] })
  allowedScopes: string[];

  @ApiProperty({ example: ['authorization_code'] })
  allowedGrants: string[];

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({
    example: {
      tokenEndpointAuthMethod: 'client_secret_basic',
      accessTokenTTL: 3600,
    },
  })
  settings: Record<string, any>;
}
export class PaginatedClientSwaggerModel {
  @ApiProperty({ type: [ClientSwaggerModel] })
  nodes: ClientSwaggerModel[];

  @ApiProperty({
    example: {
      totalCount: 1,
      currentPage: 1,
      hasNextPage: false,
      totalPages: 1,
    },
  })
  meta: Record<string, any>;
}
class UnAuthorizedResponseSwaggerModel {
  @ApiProperty({ example: 'Invalid API key' })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
class NotFoundResponseSwaggerModel {
  @ApiProperty({ example: 'Client not found' })
  message: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
