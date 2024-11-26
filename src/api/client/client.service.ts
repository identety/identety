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
    const clientId = IdGenerator.generateClientId({ prefix: payload.type });
    const clientSecret = IdGenerator.generateClientSecret();

    return this.clientRepository.createOne({
      ...payload,
      clientId,
      clientSecret: payload.type === 'public' ? undefined : clientSecret,
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
