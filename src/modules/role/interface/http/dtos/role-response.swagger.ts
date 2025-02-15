// src/modules/role/interface/http/dtos/role-response.swagger.ts

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

export class RoleResponseSwagger {
  static GetRoleList() {
    return applyDecorators(
      ApiOperation({ summary: 'Get all roles' }),
      ApiOkResponse({
        description: 'Roles retrieved successfully',
        type: PaginatedRoleResponseModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
    );
  }

  static GetRoleById() {
    return applyDecorators(
      ApiOperation({ summary: 'Get role details by id' }),
      ApiResponse({
        status: 200,
        description: 'Role found successfully',
        type: RoleSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Role not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }

  static CreateRole() {
    return applyDecorators(
      ApiOperation({ summary: 'Create role' }),
      ApiCreatedResponse({
        description: 'Role created successfully.',
        type: RoleSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
    );
  }

  static UpdateRole() {
    return applyDecorators(
      ApiOperation({ summary: 'Update role' }),
      ApiResponse({
        status: 200,
        description: 'Role updated successfully',
        type: RoleSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Role not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }

  static DeleteRole() {
    return applyDecorators(
      ApiOperation({ summary: 'Delete role' }),
      ApiResponse({
        status: 200,
        description: 'Role deleted successfully',
        type: RoleSwaggerModel,
      }),
      ApiUnauthorizedResponse({
        description: 'Unauthorized. Invalid API key.',
        type: UnAuthorizedResponseSwaggerModel,
      }),
      ApiNotFoundResponse({
        description: 'Role not found',
        type: NotFoundResponseSwaggerModel,
      }),
    );
  }
}

// Response Models
class RoleSwaggerModel {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'admin_role' })
  name: string;

  @ApiProperty({ example: 'Administrator role with full access' })
  description?: string;

  @ApiProperty({ example: false })
  is_system: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class PaginatedRoleResponseModel {
  @ApiProperty({ type: [RoleSwaggerModel] })
  nodes: RoleSwaggerModel[];

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
