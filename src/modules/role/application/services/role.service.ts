import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../ports/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
