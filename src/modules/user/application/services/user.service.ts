import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
