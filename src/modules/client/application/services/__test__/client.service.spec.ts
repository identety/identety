import { Test } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { ClientRepository } from '../../ports/client.repository';
import { Client, CreateClientDomainDto } from '../../../domain/models/client';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'node:crypto';

describe('ClientService', () => {
  let service: ClientService;
  let repository: jest.Mocked<ClientRepository>;

  const mockPublicClient: Client = {
    id: crypto.randomUUID(),
    name: 'Test Public Client',
    clientId: '',
    clientSecret: '',
    requirePkce: true,
    allowedGrants: ['authorization_code', 'refresh_token', 'password'],
    type: 'public',
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

    it('should throw BadRequestException for invalid scopes', async () => {
      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
        allowedGrants: ['authorization_code'],
        allowedScopes: ['invalid_scope'], // Invalid scope
      };

      await expect(service.createClient(mockPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid grants', async () => {
      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
        allowedGrants: ['invalid_grant'] as any, // Invalid grant
        allowedScopes: ['openid'],
      };

      await expect(service.createClient(mockPayload)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create m2m client with correct scopes and grants', async () => {
      const m2mClient: Client = {
        ...mockPublicClient,
        type: 'm2m',
        allowedGrants: ['client_credentials'],
        allowedScopes: ['offline_access', 'identety:god'],
      };
      repository.createOne.mockResolvedValue(m2mClient);

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
          clientSecret: expect.stringContaining(`${mockPayload.type}_secret_`), // Should have a secret
        }),
      );
    });
  });

  describe('getAllowedGrandsForClientType', () => {
    it('should return correct grants for public client', () => {
      const grants = service.getAllowedGrandsForClientType('public');
      expect(grants).toEqual([
        'authorization_code',
        'refresh_token',
        'password',
        'token',
      ]);
    });

    it('should return correct grants for m2m client', () => {
      const grants = service.getAllowedGrandsForClientType('m2m');
      expect(grants).toEqual(['client_credentials']);
    });
  });

  describe('getAllowedScopesForClientType', () => {
    it('should return correct scopes for public client', () => {
      const scopes = service.getAllowedScopesForClientType('public');
      expect(scopes).toEqual(['openid', 'profile', 'email', 'offline_access']);
    });

    it('should return correct scopes for m2m client', () => {
      const scopes = service.getAllowedScopesForClientType('m2m');
      expect(scopes).toEqual([
        'offline_access',
        'client_credentials',
        'identety:god',
      ]);
    });
  });
});
