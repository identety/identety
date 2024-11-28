// src/modules/clients/dto/create-client.dto.ts
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsBoolean,
  IsUrl,
  ValidateNested,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

// src/modules/clients/dto/update-client.dto.ts
export class UpdateClientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  redirectUris?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedScopes?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ClientSettings)
  settings?: ClientSettings;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ClientResponseDto extends CreateClientDto {
  @ApiProperty({ description: 'Client ID' })
  id: string;
}
