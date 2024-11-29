import { Injectable } from '@nestjs/common';
import { OrgRepository } from '../ports/org.repository';

@Injectable()
export class OrgService {
  constructor(private readonly repository: OrgRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
