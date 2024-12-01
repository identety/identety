import { Test } from '@nestjs/testing';
import { ClientService } from '../client.service';
import { ClientRepository } from '../../ports/client.repository';
import { Client, CreateClientDomainDto } from '../../../domain/models/client';
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
    it('should create public client without client secret', async () => {
      repository.createOne.mockResolvedValue(mockPublicClient);

      // Act
      const mockPayload: CreateClientDomainDto = {
        type: 'public',
        name: 'Test Public Client',
        allowedGrants: ['authorization_code', 'refresh_token', 'password'],
        allowedScopes: ['openid', 'profile', 'email', 'offline_access'],
      };

      await service.createClient(mockPayload);

      // Assert the repository received the correct payload
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
  });
});
