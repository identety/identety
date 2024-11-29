import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../ports/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
