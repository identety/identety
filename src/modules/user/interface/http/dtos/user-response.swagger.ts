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
import { IsOptional, IsString } from 'class-validator';

// src/modules/users/responses/user.response.ts
export class UserResponseSwagger {
  static GetUserList() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all users' }),
      ApiOkResponse({
        description: 'Users retrieved successfully',
        type: PaginatedUsersResponseModel,
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
        type: UserResponseModel,
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
        type: UserResponseModel,
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
        type: UserResponseModel,
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
        type: UserResponseModel,
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
export class UserAddressResponseModel {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsOptional()
  locality?: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;
}

class UserResponseModel {
  @ApiProperty({ example: '43fad864-738d-4367-a012-2b8c6948c36a' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ApiProperty({ example: 'John' })
  givenName?: string;

  @ApiProperty({ example: 'Doe' })
  familyName?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  picture?: string;

  @ApiProperty({ example: 'en-US' })
  locale?: string;

  @ApiProperty({ type: UserAddressResponseModel })
  address?: UserAddressResponseModel;

  @ApiProperty({ example: { customField: 'value' } })
  metadata?: Record<string, any>;
}
export class PaginatedUsersResponseModel {
  @ApiProperty({ type: [UserResponseModel] })
  nodes: UserResponseModel[];

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
