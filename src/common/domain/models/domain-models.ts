// src/domain/models/index.ts

// Base interfaces for common properties
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantScoped {
  tenantId: string;
}

// 1. Tenant
export interface Tenant extends BaseEntity {
  name: string;
  domain?: string;
  settings: TenantSettings;
  isActive: boolean;
}

export interface TenantSettings {
  allowedOrigins?: string[];
  loginOptions?: {
    passwordPolicy?: PasswordPolicy;
    mfaEnabled?: boolean;
  };
  sessionConfig?: {
    accessTokenTTL: number;
    refreshTokenTTL: number;
  };
}

// 2. Client
export interface Client extends BaseEntity, TenantScoped {
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
}

export type ClientType = 'public' | 'private' | 'm2m';
export type GrantType =
  | 'authorization_code'
  | 'client_credentials'
  | 'refresh_token';

export interface ClientSettings {
  tokenEndpointAuthMethod?:
    | 'none'
    | 'client_secret_basic'
    | 'client_secret_post';
  accessTokenTTL?: number;
  refreshTokenTTL?: number;
  allowedCorsOrigins?: string[];
}

// 3. User
export interface User extends BaseEntity, TenantScoped {
  email: string;
  passwordHash?: string;
  // OIDC Standard Claims
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  locale?: string;
  timezone?: string;
  emailVerified: boolean;
  isActive: boolean;
  metadata: UserMetadata;
}

export interface UserMetadata {
  lastLogin?: Date;
  loginAttempts?: number;
  lastPasswordChange?: Date;
  customAttributes?: Record<string, any>;
}

// 4. Role
export interface Role extends BaseEntity, TenantScoped {
  name: string;
  description?: string;
  isSystem: boolean;
  permissions?: Permission[];
}

// 5. Permission
export interface Permission extends BaseEntity, TenantScoped {
  name: string;
  description?: string;
}

// 6. Authorization Code
export interface AuthorizationCode extends BaseEntity, TenantScoped {
  clientId: string;
  userId: string;
  code: string;
  scopes: string[];
  codeChallenge?: string;
  codeChallengeMethod?: 'S256';
  redirectUri: string;
  expiresAt: Date;
}

// 7. Token
export interface Token extends BaseEntity, TenantScoped {
  clientId: string;
  userId?: string;
  type: TokenType;
  token: string;
  scopes: string[];
  expiresAt: Date;
  metadata: TokenMetadata;
}

export type TokenType = 'access_token' | 'refresh_token';

export interface TokenMetadata {
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  lastUsed?: Date;
}

// 8. Confirmation Token
export interface ConfirmationToken extends BaseEntity, TenantScoped {
  userId: string;
  token: string;
  type: ConfirmationTokenType;
  expiresAt: Date;
  metadata: ConfirmationTokenMetadata;
}

export type ConfirmationTokenType = 'account_confirmation' | 'password_reset';

export interface ConfirmationTokenMetadata {
  attempts?: number;
  lastAttempt?: Date;
  requestIp?: string;
}

// Additional types

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
}

// DTOs (Data Transfer Objects)

export interface CreateTenantDto {
  name: string;
  domain?: string;
  settings?: Partial<TenantSettings>;
}

export interface CreateClientDto {
  name: string;
  type: ClientType;
  redirectUris?: string[];
  allowedScopes: string[];
  allowedGrants: GrantType[];
  settings?: Partial<ClientSettings>;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  metadata?: Partial<UserMetadata>;
}

export interface AssignRoleDto {
  userId: string;
  roleIds: string[];
}

// Response Types

export interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string; // For OIDC flows
}

export interface UserInfoResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  [key: string]: any; // Additional claims
}

// Error Types

export class DomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class TenantNotFoundError extends DomainError {
  constructor(tenantId: string) {
    super(`Tenant not found: ${tenantId}`, 'TENANT_NOT_FOUND', 404);
  }
}

export class ClientNotFoundError extends DomainError {
  constructor(clientId: string) {
    super(`Client not found: ${clientId}`, 'CLIENT_NOT_FOUND', 404);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User not found: ${userId}`, 'USER_NOT_FOUND', 404);
  }
}

// Type Guards

export const isM2MClient = (client: Client): boolean => {
  return client.type === 'm2m';
};

export const isPublicClient = (client: Client): boolean => {
  return client.type === 'public';
};

export const isPrivateClient = (client: Client): boolean => {
  return client.type === 'private';
};

// Utility Types

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;
export type WithoutId<T> = Omit<T, 'id'>;
export type CreateEntity<T> = WithoutId<WithoutTimestamps<T>>;
