import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@/api/client/client.repository';
import {
  ClientResponseDomainDto,
  CreateClientDomainDto,
} from '@/common/domain/models/client';
import { IdGenerator } from '@/common/utils/id-generator';

@Injectable()
export class ClientService {
  constructor(public readonly clientRepository: ClientRepository) {}

  /**
   * Creates a new client.
   * @param payload
   */
  async create(
    payload: CreateClientDomainDto,
  ): Promise<ClientResponseDomainDto> {
    // Generating client ID and secret
    const clientId = IdGenerator.generateClientId({ prefix: payload.type });
    const clientSecret = IdGenerator.generateClientSecret();

    // Creating client
    return this.clientRepository.createOne({
      clientId,
      clientSecret: payload?.type === 'public' ? '' : clientSecret,
      name: payload.name,
      allowedGrants: payload.allowedGrants ?? [
        'authorization_code',
        'password',
      ],
      allowedScopes: payload.allowedScopes ?? ['openid', 'profile', 'email'],
      redirectUris:
        payload?.redirectUris?.map((uri) => uri.replace(/ /g, '%20')) ?? [],
      requirePkce: payload.type == 'public',
      isActive: true,
      type: payload?.type ?? 'public',
      settings: payload?.settings ?? {
        accessTokenTTL: 60 * 60,
        refreshTokenTTL: 60 * 60 * 24 * 7,
        tokenEndpointAuthMethod: 'client_secret_basic', // TODO: Learn more about this
      },
    });
  }

  // async findById(id: string): Promise<ClientResponseDomainDto | null> {
  //   return this.clientRepository.findOne(id);
  // }
  //
  // async findByClientId(
  //   clientId: string,
  // ): Promise<ClientResponseDomainDto | null> {
  //   return this.clientRepository.findOne({ clientId });
  // }
  //
  // async update(
  //   id: string,
  //   payload: CreateClientDomainDto,
  // ): Promise<ClientResponseDomainDto> {
  //   return this.clientRepository.updateOne(id, payload);
  // }
  //
  // async delete(id: string): Promise<void> {
  //   return this.clientRepository.deleteOne(id);
  // }
  //
  // async list(): Promise<ClientResponseDomainDto[]> {
  //   return this.clientRepository.findAllWithPagination();
  // }
}
