import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ClientService } from '../client.service';
import { ClientRepository } from '../../ports/client.repository';
import {
  Client,
  ClientType,
  CreateClientDomainDto,
  GrantType,
  UpdateClientDomainDto,
} from '../../../domain/models/client';

describe('ClientService', () => {
  let service: ClientService;
  let repository: jest.Mocked<ClientRepository>;

  const mockPublicClient: Client = {
    id: crypto.randomUUID(),
    name: 'Test Public Client',
    clientId: '',
    clientSecret: '',
    requirePkce: true,
    allowedGrants: [
      'authorization_code',
      'refresh_token',
      'password',
    ] as GrantType[],
    type: 'public' as ClientType,
    allowedScopes: ['openid', 'profile', 'email', 'offline_access'],
    redirectUris: [''],
    settings: {
      accessTokenTTL: 60 * 60 * 1000,
      refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
      tokenEndpointAuthMethod: 'client_secret_basic',
    },
    isActive: true,
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 1, 1),
  };
  const mockPrivateClient: Client = {
    id: crypto.randomUUID(),
    name: 'Test Private Client',
    clientId: '',
    clientSecret: '',
    requirePkce: false,
    allowedGrants: [
      'authorization_code',
      'refresh_token',
      'password',
    ] as GrantType[],
    type: 'private' as ClientType,
    allowedScopes: ['openid', 'profile', 'email', 'offline_access'],
    redirectUris: [''],
    settings: {
      accessTokenTTL: 60 * 60 * 1000,
      refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
      tokenEndpointAuthMethod: 'client_secret_basic',
    },
    isActive: true,
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 1, 1),
  };
  const mockM2MClient: Client = {
    id: crypto.randomUUID(),
    name: 'Test M2M Client',
    clientId: '',
    clientSecret: '',
    requirePkce: true,
    allowedGrants: ['client_credentials'],
    type: 'm2m' as ClientType,
    allowedScopes: ['offline_access', 'identety:god'],
    redirectUris: [''],
    settings: {
      accessTokenTTL: 60 * 60 * 1000,
      refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
      tokenEndpointAuthMethod: 'client_secret_basic',
    },
    isActive: true,
    createdAt: new Date(2024, 1, 1),
    updatedAt: new Date(2024, 1, 1),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: ClientRepository,
          useValue: {
            findAllWithPagination: jest.fn(),
            createOne: jest.fn(),
            updateOne: jest.fn(),
            findRows: jest.fn(),
            deleteRows: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    repository = module.get(ClientRepository);
  });

  describe('createClient', () => {
    // Happy path
    it('should create public client successfully', async () => {
      repository.createOne.mockResolvedValue(mockPublicClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
        allowedGrants: ['authorization_code', 'refresh_token', 'password'],
        allowedScopes: ['openid', 'profile', 'email', 'offline_access'],
      };

      await service.createClient(mockPayload);

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: expect.any(String),
          clientSecret: '',
          name: 'Test Public Client',
          type: 'public',
          allowedGrants: mockPayload.allowedGrants,
          allowedScopes: mockPayload.allowedScopes,
        }),
      );
    });
    it('should create private client with correct scopes and grants', async () => {
      repository.createOne.mockResolvedValue(mockPrivateClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'private',
        name: 'Test Private Client',
        allowedGrants: ['password'],
      };

      await service.createClient(mockPayload);

      // const calledWith = repository.createOne.mock.calls[0][0];
      // console.log(calledWith);

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockPayload.type,
          clientId: expect.stringContaining('private_'),
          clientSecret: expect.stringContaining(`${mockPayload.type}_secret_`), // Should have a secret
        }),
      );
    });
    it('should create m2m client with correct scopes and grants', async () => {
      repository.createOne.mockResolvedValue(mockM2MClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'm2m',
        name: 'Test M2M Client',
        allowedGrants: ['client_credentials'],
        allowedScopes: ['offline_access', 'identety:god'],
      };

      await service.createClient(mockPayload);

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'm2m',
          allowedGrants: ['client_credentials'],
          allowedScopes: expect.arrayContaining(['identety:god']),
          clientId: expect.stringContaining('m2m_'),
          clientSecret: expect.stringContaining(`${mockPayload.type}_secret_`), // Should have a secret
        }),
      );
    });

    // Creates wth default settings
    it('should create public client with default settings', async () => {
      const defaultPublicClientConfig =
        service.getClientDefaultConfig('public');

      repository.createOne.mockResolvedValue(mockPublicClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
      };

      await service.createClient(mockPayload);

      // const calledWith = repository.createOne.mock.calls[0][0];
      // console.log({ calledWith, defaultPublicClientConfig });

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockPayload.type,
          name: mockPayload.name,
          clientId: expect.stringContaining('public_'),
          clientSecret: '', // Should have a secret
          allowedGrants: defaultPublicClientConfig.allowedGrants,
          allowedScopes: defaultPublicClientConfig.allowedScopes,
          settings: defaultPublicClientConfig.settings,
        }),
      );
    });
    it('should create private client with default settings', async () => {
      const defaultPrivateClientConfig =
        service.getClientDefaultConfig('private');

      repository.createOne.mockResolvedValue(mockPrivateClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'private',
        name: 'Test private Client',
      };

      await service.createClient(mockPayload);

      // const calledWith = repository.createOne.mock.calls[0][0];
      // console.log({ calledWith, defaultPrivateClientConfig });

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockPayload.type,
          name: mockPayload.name,
          clientId: expect.stringContaining('private_'),
          clientSecret: expect.stringContaining(`private_secret_`), // Should have a secret
          allowedGrants: defaultPrivateClientConfig.allowedGrants,
          allowedScopes: defaultPrivateClientConfig.allowedScopes,
          settings: defaultPrivateClientConfig.settings,
        }),
      );
    });
    it('should create m2m client with default settings', async () => {
      const defaultM2mClientConfig = service.getClientDefaultConfig('m2m');

      repository.createOne.mockResolvedValue(mockPrivateClient);

      const mockPayload: CreateClientDomainDto = {
        type: 'm2m',
        name: 'Test m2m Client',
      };

      await service.createClient(mockPayload);

      // const calledWith = repository.createOne.mock.calls[0][0];
      // console.log({ calledWith, defaultPrivateClientConfig });

      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mockPayload.type,
          name: mockPayload.name,
          clientId: expect.stringContaining('m2m_'),
          clientSecret: expect.stringContaining(`m2m_secret_`), // Should have a secret
          allowedGrants: defaultM2mClientConfig.allowedGrants,
          allowedScopes: defaultM2mClientConfig.allowedScopes,
          settings: defaultM2mClientConfig.settings,
        }),
      );
    });

    // Error handling
    it('should throw BadRequestException for not allowed scopes in creating public client', async () => {
      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
        allowedGrants: ['authorization_code'],
        allowedScopes: ['client_credentials'], // not allowed
      };

      repository.createOne.mockResolvedValue(mockPublicClient);

      await expect(service.createClient(mockPayload)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.createOne).not.toHaveBeenCalled();
    });
    it('should throw BadRequestException for not allowed grants in creating m2m client', async () => {
      const mockPayload: CreateClientDomainDto = {
        type: 'm2m',
        name: 'Test m2m Client',
        allowedGrants: ['authorization_code'],
      };

      repository.createOne.mockResolvedValue(mockM2MClient);

      // const calledWith = repository.createOne.mock.calls[0][0];
      // console.log(calledWith);

      await expect(service.createClient(mockPayload)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.createOne).not.toHaveBeenCalled();
    });
    it('should throw BadRequestException for not allowed grants in creating private client', async () => {
      const mockPayload: CreateClientDomainDto = {
        type: 'private',
        name: 'Test Private Client',
        allowedGrants: ['client_credentials'],
      };

      repository.createOne.mockResolvedValue(mockPrivateClient);

      await expect(service.createClient(mockPayload)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.createOne).not.toHaveBeenCalled();
    });
  });

  // describe('findById', () => {
  //   it('should return client when found', async () => {
  //     repository.findRows.mockResolvedValue([mockPublicClient]);
  //
  //     const result = await service.findById('test-id');
  //
  //     // const calledWith = repository.findRows.mock.calls[0][0];
  //     // console.log(calledWith);
  //
  //     expect(repository.findRows).toHaveBeenCalledWith({
  //       limit: 1,
  //       filters: [{ key: 'id', value: 'test-id', operator: '=' }],
  //     });
  //     expect(result).toEqual(mockPublicClient);
  //   });
  //
  //   it('should throw NotFoundException when client not found', async () => {
  //     repository.findRows.mockResolvedValue([]);
  //
  //     await expect(service.findById('non-existent-id')).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

  // describe('updateClient', () => {
  //   beforeEach(() => {
  //     // Mock findById default response
  //     repository.findRows.mockResolvedValue([mockPublicClient]);
  //   });
  //
  //   it('should update client with partial data', async () => {
  //     const updatePayload = {
  //       name: 'Updated Name',
  //     };
  //
  //     const updatedClient = {
  //       ...mockPublicClient,
  //       ...updatePayload,
  //     };
  //
  //     repository.updateOne.mockResolvedValue(updatedClient);
  //
  //     const result = await service.updateClient('test-id', updatePayload);
  //
  //     expect(repository.updateOne).toHaveBeenCalledWith(
  //       { filters: [{ key: 'id', value: 'test-id', operator: '=' }] },
  //       updatePayload,
  //     );
  //     expect(result.name).toBe('Updated Name');
  //   });
  //
  //   it('should update client with valid scopes and grants', async () => {
  //     const updatePayload: UpdateClientDomainDto = {
  //       allowedScopes: ['openid', 'profile'],
  //       allowedGrants: ['authorization_code', 'refresh_token', 'password'],
  //     };
  //
  //     const updatedClient: Client = {
  //       ...mockPublicClient,
  //       ...updatePayload,
  //     };
  //
  //     repository.updateOne.mockResolvedValue(updatedClient);
  //
  //     const result = await service.updateClient('test-id', updatePayload);
  //
  //     expect(result.allowedScopes).toEqual(['openid', 'profile']);
  //     expect(result.allowedGrants).toEqual([
  //       'authorization_code',
  //       'refresh_token',
  //       'password',
  //     ]);
  //   });
  //
  //   it('should throw BadRequestException for invalid scopes', async () => {
  //     const updatePayload = {
  //       allowedScopes: ['invalid_scope'],
  //     };
  //
  //     await expect(
  //       service.updateClient('test-id', updatePayload),
  //     ).rejects.toThrow(BadRequestException);
  //
  //     expect(repository.updateOne).not.toHaveBeenCalled();
  //   });
  //
  //   it('should throw BadRequestException for invalid grants', async () => {
  //     const updatePayload = {
  //       allowedGrants: ['invalid_grant'],
  //     };
  //
  //     await expect(
  //       service.updateClient('test-id', updatePayload),
  //     ).rejects.toThrow(BadRequestException);
  //
  //     expect(repository.updateOne).not.toHaveBeenCalled();
  //   });
  //
  //   it('should throw NotFoundException when client not found', async () => {
  //     repository.findRows.mockResolvedValue([]); // Client not found
  //
  //     const updatePayload = {
  //       name: 'Updated Name',
  //     };
  //
  //     await expect(
  //       service.updateClient('non-existent-id', updatePayload),
  //     ).rejects.toThrow(NotFoundException);
  //
  //     expect(repository.updateOne).not.toHaveBeenCalled();
  //   });
  //
  //   it('should allow update without changing scopes or grants', async () => {
  //     const updatePayload = {
  //       name: 'Updated Name Only',
  //     };
  //
  //     const updatedClient = {
  //       ...mockPublicClient,
  //       name: 'Updated Name Only',
  //     };
  //
  //     repository.updateOne.mockResolvedValue(updatedClient);
  //
  //     const result = await service.updateClient('test-id', updatePayload);
  //
  //     expect(repository.updateOne).toHaveBeenCalled();
  //     expect(result.name).toBe('Updated Name Only');
  //     expect(result.allowedScopes).toEqual(mockPublicClient.allowedScopes);
  //     expect(result.allowedGrants).toEqual(mockPublicClient.allowedGrants);
  //   });
  //
  //   it('should respect client type specific validations', async () => {
  //     // Mock M2M client
  //     const m2mClient = {
  //       ...mockPublicClient,
  //       type: 'm2m',
  //       allowedGrants: ['client_credentials'],
  //       allowedScopes: ['offline_access', 'identety:god'],
  //     };
  //     repository.findRows.mockResolvedValue([m2mClient]);
  //
  //     // Try updating with invalid m2m scopes
  //     const invalidPayload = {
  //       allowedScopes: ['openid'], // not allowed for m2m
  //     };
  //
  //     await expect(
  //       service.updateClient('test-id', invalidPayload),
  //     ).rejects.toThrow(BadRequestException);
  //   });
  // });
  //
  // describe('getAllowedGrandsForClientType', () => {
  //   it('should return correct grants for public client', () => {
  //     const grants = service.getAllowedGrandsForClientType('public');
  //     expect(grants).toEqual([
  //       'authorization_code',
  //       'refresh_token',
  //       'password',
  //       'token',
  //     ]);
  //   });
  //
  //   it('should return correct grants for m2m client', () => {
  //     const grants = service.getAllowedGrandsForClientType('m2m');
  //     expect(grants).toEqual(['client_credentials']);
  //   });
  // });
  //
  // describe('getAllowedScopesForClientType', () => {
  //   it('should return correct scopes for public client', () => {
  //     const scopes = service.getAllowedScopesForClientType('public');
  //     expect(scopes).toEqual(['openid', 'profile', 'email', 'offline_access']);
  //   });
  //
  //   it('should return correct scopes for m2m client', () => {
  //     const scopes = service.getAllowedScopesForClientType('m2m');
  //     expect(scopes).toEqual([
  //       'offline_access',
  //       'client_credentials',
  //       'identety:god',
  //     ]);
  //   });
  // });
});
