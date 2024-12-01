import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../ports/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async findById(id: string) {
    const [user] = await this.repository.findRows({
      filters: [{ key: 'id', operator: '=', value: id }],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
