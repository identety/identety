import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../../application/ports/client.repository';
import {
  Client,
  ClientResponseDomainDto,
  ClientType,
  CreateClientDomainDto,
  GrantType,
  UpdateClientDomainDto,
} from '../../domain/models/client';
import { IdGeneratorUtil } from '@/shared/utils/id-generator.util';
import { ClientListQueryDto } from '@/modules/client/interface/http/dtos/client.dto';
import {
  AppInvalidInputException,
  AppNotFoundException,
} from '@/shared/application/exceptions/appException';

@Injectable()
export class ClientService {
  constructor(public readonly clientRepository: ClientRepository) {}

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
          requirePkce: false,
          allowedGrants: ['client_credentials'],
          type: 'm2m',
          allowedScopes: ['offline_access', 'identety:god'],
          redirectUris: [],
          settings: {
            accessTokenTTL: 60 * 60 * 1000,
            refreshTokenTTL: 60 * 60 * 24 * 7 * 1000,
            tokenEndpointAuthMethod: 'client_secret_basic',
          },
        };
    }
  }

  getAllowedGrandsForClientType(clientType: ClientType): GrantType[] {
    switch (clientType) {
      case 'public':
        return ['authorization_code', 'refresh_token', 'password', 'token'];
      case 'private':
        return ['authorization_code', 'refresh_token', 'password'];
      case 'm2m':
        return ['client_credentials'];
    }
  }

  getAllowedScopesForClientType(clientType: ClientType): string[] {
    switch (clientType) {
      case 'public':
        return ['openid', 'profile', 'email', 'offline_access'];
      case 'private':
        return ['openid', 'profile', 'email', 'offline_access'];
      case 'm2m':
        return ['offline_access', 'client_credentials', 'identety:god'];
    }
  }

  findAllClientsWithPagination(queries: ClientListQueryDto) {
    const defaultSortBy = 'created_at';
    const defaultSort = 'DESC';

    const defaultColumns = [
      'id',
      'client_id',
      'name',
      'type',
      'created_at',
      'updated_at',
    ];

    return this.clientRepository.findAllWithPagination({
      limit: queries.limit,
      page: queries.page,
      orderBy: [
        {
          key: queries?.sortBy || (defaultSortBy as any),
          direction: queries.sort || (defaultSort as any),
        },
      ],
      columns: (queries?.columns as any) || defaultColumns,
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
    const clientId = IdGeneratorUtil.generateClientId({ prefix: payload.type });
    const clientSecret = IdGeneratorUtil.generateClientSecret({
      prefix: `${payload.type}_secret`,
    });

    // check for allowed scopes
    const allowedScopes = this.getAllowedScopesForClientType(payload.type);
    if (
      payload.allowedScopes?.some((scope) => !allowedScopes.includes(scope))
    ) {
      throw new AppInvalidInputException(
        `Invalid scope. Allowed scopes are: ${allowedScopes.join(', ')}`,
      );
    }

    // check for allowed grants
    const allowedGrants = this.getAllowedGrandsForClientType(payload.type);
    if (
      payload.allowedGrants?.some((grant) => !allowedGrants.includes(grant))
    ) {
      throw new AppInvalidInputException(
        `Invalid grant. Allowed grants are: ${allowedGrants.join(', ')}`,
      );
    }

    // Creating client
    return this.clientRepository.createOne({
      ...this.getClientDefaultConfig(payload.type),
      clientId,
      clientSecret: payload?.type === 'public' ? '' : clientSecret,
      ...payload,
    });
  }

  async updateClient(
    id: string,
    payload: UpdateClientDomainDto,
  ): Promise<Client> {
    const client = await this.findById(id);

    // check for allowed scopes
    const allowedScopes = this.getAllowedScopesForClientType(client.type);
    if (
      payload.allowedScopes?.some((scope) => !allowedScopes.includes(scope))
    ) {
      throw new AppInvalidInputException(
        `Invalid scope. Allowed scopes are: ${allowedScopes.join(', ')}`,
      );
    }

    // check for allowed grants
    const allowedGrants = this.getAllowedGrandsForClientType(client.type);
    if (
      payload.allowedGrants?.some((grant) => !allowedGrants.includes(grant))
    ) {
      throw new AppInvalidInputException(
        `Invalid grant. Allowed grants are: ${allowedGrants.join(', ')}`,
      );
    }

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

    if (!client) throw new AppNotFoundException();
    return client;
  }

  /**
   * Deletes a client by its ID.
   * @param id
   */
  async deleteClientById(id: string): Promise<ClientResponseDomainDto> {
    const [client] = await this.clientRepository.findRows({
      limit: 1,
      filters: [{ key: 'id', value: id, operator: '=' }],
    });

    if (!client) throw new AppNotFoundException();
    await this.clientRepository.deleteRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
    });

    return client;
  }
}
