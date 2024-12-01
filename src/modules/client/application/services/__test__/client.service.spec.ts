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

  describe('findById', () => {
    it('should return client when found', async () => {
      repository.findRows.mockResolvedValue([mockPrivateClient]);

      const result = await service.findById('test-id');

      // const calledWith = repository.findRows.mock.calls[0][0];
      // console.log({ calledWith, result });

      expect(repository.findRows).toHaveBeenCalledWith({
        limit: 1,
        filters: [{ key: 'id', value: 'test-id', operator: '=' }],
      });
      expect(result).toEqual(mockPrivateClient);
    });

    it('should throw NotFoundException when client not found', async () => {
      repository.findRows.mockResolvedValue([]);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateClient', () => {
    describe('scope validation', () => {
      it('should allow update with valid scopes', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);

        const payload: UpdateClientDomainDto = {
          allowedScopes: ['openid', 'profile'],
        };

        await service.updateClient('test-id', payload);
        expect(repository.findRows).toHaveBeenCalled();
      });

      it('should throw BadRequestException for invalid scopes', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);

        const payload = {
          allowedScopes: ['invalid_scope', 'openid'], // One invalid scope
        };

        await expect(service.updateClient('test-id', payload)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should allow update without scopes', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);
        const payload = {
          name: 'Updated Name', // No scopes in payload
        };

        await service.updateClient('test-id', payload);

        expect(repository.updateOne).toHaveBeenCalled();
      });
    });

    describe('grant validation', () => {
      beforeEach(() => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);
      });

      it('should allow update with valid grants', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);
        const payload: UpdateClientDomainDto = {
          allowedGrants: ['authorization_code', 'refresh_token'],
        };

        await service.updateClient('test-id', payload);

        // const calledWith = repository.updateOne.mock.calls[0][0];
        // console.log({ calledWith });

        expect(repository.updateOne).toHaveBeenCalled();
      });

      it('should throw BadRequestException for not allowed grants', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);
        const payload: UpdateClientDomainDto = {
          allowedGrants: ['client_credentials'],
        };

        await expect(service.updateClient('test-id', payload)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should allow update without grants', async () => {
        repository.findRows = jest.fn().mockResolvedValue([mockPublicClient]);
        const payload = {
          name: 'Updated Name', // No grants in payload
        };

        await service.updateClient('test-id', payload);

        expect(repository.updateOne).toHaveBeenCalled();
      });
    });

    describe('client type specific validation', () => {
      it('should validate against m2m client allowed scopes', async () => {
        // Mock m2m client
        repository.findRows.mockResolvedValue([mockM2MClient]);

        const payload = {
          allowedScopes: ['openid'], // Not allowed for m2m
        };

        await expect(service.updateClient('test-id', payload)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should validate against m2m client allowed grants', async () => {
        repository.findRows.mockResolvedValue([mockM2MClient]);

        const payload: UpdateClientDomainDto = {
          allowedGrants: ['authorization_code'],
        };

        await expect(service.updateClient('test-id', payload)).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('error handling', () => {
      it('should throw NotFoundException when client not found', async () => {
        repository.findRows.mockResolvedValue([]); // Client not found

        await expect(service.updateClient('test-id', {})).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
