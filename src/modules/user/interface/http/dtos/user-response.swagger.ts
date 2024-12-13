import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  NotFoundResponseSwaggerModel,
  UnAuthorizedResponseSwaggerModel,
} from '@/shared/interface/http/dtos/common-swagger-responses';

export class UserResponseSwagger {
  static GetUserList() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all users' }),
      ApiOkResponse({
        description: 'Users retrieved successfully',
        type: PaginatedUsersSwaggerModel,
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
        type: UserSwaggerModel,
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
        type: UserSwaggerModel,
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
        type: UserSwaggerModel,
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
        type: UserSwaggerModel,
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
class UserSwaggerModel {
  @ApiProperty({ example: 'uuid-123' })
  id: string;
}
export class PaginatedUsersSwaggerModel {
  @ApiProperty({ type: [UserSwaggerModel] })
  nodes: UserSwaggerModel[];

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
