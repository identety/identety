// src/modules/role/interface/http/dtos/role.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CommonPaginationDto } from '@/shared/interface/http/dtos/common-pagination.dto';

// Create DTO
export class CreateRoleDto {
  @ApiProperty({
    example: 'Content Editor',
    description: 'Role name will be converted to snake_case automatically',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'Can manage and publish content',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: false,
    required: false,
    description:
      'Whether this is a system role. Cannot be set to true manually.',
  })
  @IsBoolean()
  @IsOptional()
  is_system?: boolean;
}

// Update DTO
export class UpdateRoleDto {
  @ApiProperty({
    example: 'Content Manager',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Can manage all content and users',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: false,
    required: false,
    description: 'System roles cannot be modified',
  })
  @IsBoolean()
  @IsOptional()
  is_system?: boolean;
}

// List Query DTO
export class RoleListQueryDto extends CommonPaginationDto {
  @ApiProperty({
    description: 'Comma separated column names',
    example: 'id,name,description,is_system,created_at',
    enum: [
      'id',
      'name',
      'description',
      'is_system',
      'created_at',
      'updated_at',
    ],
    required: false,
  })
  @IsOptional()
  @IsIn(
    ['id', 'name', 'description', 'is_system', 'created_at', 'updated_at'],
    { each: true },
  )
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((col) => col.trim())
      : value,
  )
  columns?: string[];
}
