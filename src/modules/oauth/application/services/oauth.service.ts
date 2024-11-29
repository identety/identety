import { Injectable } from '@nestjs/common';
import { OauthRepository } from '../ports/oauth.repository';

@Injectable()
export class OauthService {
  constructor(private readonly repository: OauthRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
