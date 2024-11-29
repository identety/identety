import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from '@/modules/client/application/ports/client.repository';
import {
  Client,
  ClientResponseDomainDto,
  ClientType,
  CreateClientDomainDto,
  UpdateClientDomainDto,
} from '@/modules/client/domain/models/client';
import { IdGenerator } from '@/shared/utils/id-generator';
import { CommonPaginationDto } from '@/shared/interface/http/dtos/common-pagination.dto';

@Injectable()
export class ClientService {
  constructor(public readonly clientRepository: ClientRepository) {}

  findAllClientsWithPagination(queries: CommonPaginationDto) {
    return this.clientRepository.findAllWithPagination({
      limit: queries.limit,
      page: queries.page,
      orderBy: [{ key: queries.sortBy as any, direction: queries.sort }],
    });
  }

  /**
   * Creates a new client.
   * @param payload
   */
  async createClient(
    payload: CreateClientDomainDto,
  ): Promise<ClientResponseDomainDto> {
    // Generating client ID and secret
    const clientId = IdGenerator.generateClientId({ prefix: payload.type });
    const clientSecret = IdGenerator.generateClientSecret();

    // Creating client
    return this.clientRepository.createOne({
      ...this.getClientDefaultConfig(payload.type),
      clientId,
      clientSecret: payload?.type === 'public' ? '' : clientSecret,
      ...payload,
    });
  }

  updateClient(id: string, payload: UpdateClientDomainDto): Promise<Client> {
    return this.clientRepository.updateOne(
      { filters: [{ key: 'id', value: id, operator: '=' }] },
      payload,
    );
  }

  /**
   * Finds a client by its ID.
   * @param id
   */
  async findById(id: string): Promise<ClientResponseDomainDto | null> {
    const [client] = await this.clientRepository.findRows({
      limit: 1,
      filters: [{ key: 'id', value: id, operator: '=' }],
    });

    if (!client) throw new NotFoundException();
    return client;
  }

  async deleteClientById(id: string) {
    const [client] = await this.clientRepository.findRows({
      limit: 1,
      filters: [{ key: 'id', value: id, operator: '=' }],
    });

    if (!client) throw new NotFoundException();
    return this.clientRepository.deleteRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
    });
  }

  getClientDefaultConfig(clientType: ClientType): Partial<Client> {
    switch (clientType) {
      case 'public':
        return {
          // id: '',
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
        };
      case 'private':
        return {
          // id: '',
          clientId: '',
          clientSecret: '',
          requirePkce: false,
          allowedGrants: ['authorization_code', 'refresh_token', 'password'],
          type: 'private',
          allowedScopes: ['openid', 'profile', 'email', 'offline_access'],
          redirectUris: [''],
          settings: {
            accessTokenTTL: 60 * 60 * 1000,
            refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
            tokenEndpointAuthMethod: 'client_secret_basic',
          },
        };
      case 'm2m':
        return {
          // id: '',
          clientId: '',
          clientSecret: '',
          requirePkce: true,
          allowedGrants: ['client_credentials'],
          type: 'm2m',
          allowedScopes: ['offline_access', 'identety:god'],
          redirectUris: [''],
          settings: {
            accessTokenTTL: 60 * 60 * 1000,
            refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
            tokenEndpointAuthMethod: 'client_secret_basic',
          },
        };
    }
  }
}
