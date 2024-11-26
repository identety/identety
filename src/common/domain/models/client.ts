// src/domain/models/client.ts

// Core Client Model
export interface Client {
  id: string;
  clientId: string;
  clientSecret?: string;
  name: string;
  type: ClientType;
  redirectUris: string[];
  allowedScopes: string[];
  allowedGrants: GrantType[];
  isActive: boolean;
  requirePkce: boolean;
  settings: ClientSettings;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types and Enums
export type ClientType = 'public' | 'private' | 'm2m';

export type GrantType =
  | 'authorization_code'
  | 'client_credentials'
  | 'refresh_token'
  | 'password';

// Settings Interface
export interface ClientSettings {
  tokenEndpointAuthMethod?:
    | 'none'
    | 'client_secret_basic'
    | 'client_secret_post';
  accessTokenTTL?: number;
  refreshTokenTTL?: number;
  allowedCorsOrigins?: string[];
}

// DTOs
export interface CreateClientDomainDto {
  name: string;
  type: ClientType;
  redirectUris?: string[];
  allowedScopes: string[];
  allowedGrants: GrantType[];
  settings?: Partial<ClientSettings>;
}

export interface UpdateClientDomainDto {
  name?: string;
  redirectUris?: string[];
  allowedScopes?: string[];
  settings?: Partial<ClientSettings>;
  isActive?: boolean;
}

// Response Types
export interface ClientResponseDomainDto {
  id: string;
  clientId: string;
  clientSecret?: string; // Only returned on creation
  name: string;
  type: ClientType;
  redirectUris: string[];
  allowedScopes: string[];
  allowedGrants: GrantType[];
  settings: ClientSettings;
  createdAt: Date;
}

// Error Types
export class ClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ClientError';
  }
}

export class ClientNotFoundError extends ClientError {
  constructor(clientId: string) {
    super(`Client not found: ${clientId}`, 'CLIENT_NOT_FOUND', 404);
  }
}

export class InvalidClientTypeError extends ClientError {
  constructor(type: string) {
    super(`Invalid client type: ${type}`, 'INVALID_CLIENT_TYPE', 400);
  }
}

// Repository Interface
export interface IClientRepository {
  create(data: CreateClientDomainDto, tenantId?: string): Promise<Client>;
  findById(id: string, tenantId?: string): Promise<Client | null>;
  findByClientId(clientId: string, tenantId?: string): Promise<Client | null>;
  update(
    id: string,
    data: UpdateClientDomainDto,
    tenantId?: string,
  ): Promise<Client>;
  delete(id: string, tenantId?: string): Promise<void>;
  list(tenantId?: string): Promise<Client[]>;
}
