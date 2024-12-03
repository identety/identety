// src/modules/clients/dto/create-client.dto.ts
import {
  IsArray,
  IsEnum,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CommonPaginationDto } from '@/shared/interface/http/dtos/common-pagination.dto';

export enum ClientType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  M2M = 'm2m',
}

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
}

export class ClientSettings {
  @IsEnum(['none', 'client_secret_basic', 'client_secret_post'])
  @IsOptional()
  tokenEndpointAuthMethod?:
    | 'none'
    | 'client_secret_basic'
    | 'client_secret_post';

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  allowedCorsOrigins?: string[];

  @IsOptional()
  accessTokenTTL?: number;

  @IsOptional()
  refreshTokenTTL?: number;
}

export class CreateClientDto {
  @ApiProperty({ description: 'Client Name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ClientType, description: 'Client type' })
  @IsEnum(ClientType)
  type: ClientType;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Redirect URIs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  redirectUris?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Allowed Scopes',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  allowedScopes?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Allowed Grants',
    enum: GrantType,
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsEnum(GrantType, { each: true })
  allowedGrants: GrantType[];

  @ApiProperty({
    type: ClientSettings,
    description: 'Client Settings',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ClientSettings)
  settings?: ClientSettings;
}

export class UpdateClientDto extends OmitType(CreateClientDto, ['type']) {}

export class ClientListQueryDto extends CommonPaginationDto {
  @ApiProperty({
    description: 'Comma separated column names',
    example: 'id,client_id,name,type',
    enum: [
      'id',
      'client_id',
      'client_secret',
      'name',
      'type',
      'redirect_uris',
      'allowed_scopes',
      'allowed_grants',
      'is_active',
      'require_pkce',
      'settings',
      'tenant_id',
      'created_at',
      'updated_at',
    ],
  })
  @IsOptional()
  // @IsString()
  @IsIn(
    [
      'id',
      'client_id',
      'client_secret',
      'name',
      'type',
      'redirect_uris',
      'allowed_scopes',
      'allowed_grants',
      'is_active',
      'require_pkce',
      'settings',
      'tenant_id',
      'created_at',
      'updated_at',
    ],
    { each: true },
  )
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((col) => col.trim())
      : value,
  )
  columns?: string[];
}
