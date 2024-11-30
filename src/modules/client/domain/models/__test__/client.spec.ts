import {
  Client,
  ClientType,
  GrantType,
  ClientSettings,
  ClientResponseDomainDto,
} from '../client';

describe('domain:Client', () => {
  let validClientData: Client;

  beforeEach(() => {
    validClientData = {
      id: 'test-id',
      clientId: 'test-client-id',
      clientSecret: 'secret',
      name: 'Test Client',
      type: 'public',
      redirectUris: ['https://example.com/callback'],
      allowedScopes: ['read', 'write'],
      allowedGrants: ['authorization_code'],
      isActive: true,
      requirePkce: true,
      settings: {
        tokenEndpointAuthMethod: 'client_secret_basic',
        accessTokenTTL: 3600,
        refreshTokenTTL: 86400,
        allowedCorsOrigins: ['https://example.com'],
      },
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should create client with all properties', () => {
    const client = validClientData;
    expect(client).toBeDefined();
    expect(client.id).toBe('test-id');
    expect(client.clientId).toBe('test-client-id');
    expect(client.type).toBe('public');
  });

  it('should accept valid client type', () => {
    const validTypes: ClientType[] = ['public', 'private', 'm2m'];
    validTypes.forEach((type) => {
      const client = { ...validClientData, type };
      expect(client.type).toBe(type);
    });
  });

  it('should accept valid grant types', () => {
    const validGrants: GrantType[] = [
      'authorization_code',
      'client_credentials',
      'refresh_token',
      'password',
    ];
    const client = { ...validClientData, allowedGrants: validGrants };
    expect(client.allowedGrants).toEqual(validGrants);
  });

  it('should handle client settings', () => {
    const settings: ClientSettings = {
      tokenEndpointAuthMethod: 'none',
      accessTokenTTL: 1800,
      refreshTokenTTL: 43200,
      allowedCorsOrigins: ['http://localhost:3000'],
    };
    const client = { ...validClientData, settings };
    expect(client.settings).toEqual(settings);
  });

  describe('CreateClientDomainDto', () => {
    it('should create client with minimum required properties', () => {
      const createDto = {
        name: 'Minimal Client',
        type: 'public' as ClientType,
      };
      expect(createDto.name).toBeDefined();
      expect(createDto.type).toBeDefined();
    });
  });

  describe('ClientResponseDomainDto', () => {
    it('should format response correctly', () => {
      const response: ClientResponseDomainDto = {
        id: validClientData.id,
        clientId: validClientData.clientId,
        clientSecret: validClientData.clientSecret,
        name: validClientData.name,
        type: validClientData.type,
        redirectUris: validClientData.redirectUris,
        allowedScopes: validClientData.allowedScopes,
        allowedGrants: validClientData.allowedGrants,
        settings: validClientData.settings,
        createdAt: validClientData.createdAt,
      };
      expect(response).toBeDefined();
      expect(response.clientSecret).toBeDefined(); // Only on creation
    });
  });
});
