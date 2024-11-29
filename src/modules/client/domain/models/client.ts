export class Client {
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
  allowedScopes?: string[];
  allowedGrants?: GrantType[];
  settings?: Partial<ClientSettings>;
}

export type UpdateClientDomainDto = Omit<CreateClientDomainDto, 'type'>;

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
