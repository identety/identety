import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordUtil } from '@/shared/utils/password.util';
import { UserRepository } from '../ports/user.repository';
import { CreateUserDto, User } from '../../domain/models/user';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Finds a user by its ID.
   * @param id
   */
  async findById(id: string) {
    const [user] = await this.repository.findRows({
      filters: [{ key: 'id', operator: '=', value: id }],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Finds a user by its email.
   * @param email
   */
  async findByEmail(email: string): Promise<User> {
    const [user] = await this.repository.findRows({
      filters: [{ key: 'email', operator: '=', value: email }],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Creates a new user.
   * @param payload
   */
  async createUser(
    payload: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    if (payload.password) {
      payload['passwordHash'] = PasswordUtil.hashPassword(payload.password);
      delete payload?.password;
    }

    const result = await this.repository.createOne(payload);
    delete result['password_hash'];
    return result;
  }

  /**
   * Updates a user.
   * @param id
   * @param payload
   */
  async updateUser(id: string, payload: CreateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();

    return this.repository.updateOne(
      { filters: [{ key: 'id', value: id, operator: '=' }] },
      payload,
    );
  }

  /**
   * Deletes a user.
   * @param id
   */
  async deleteUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();

    return this.repository.deleteRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
    });
  }

  /**
   * Updates a user's password.
   * @param id
   * @param password
   */
  async updatePassword(id: string, password: string): Promise<boolean> {
    try {
      await this.repository.updateOne(
        { filters: [{ key: 'id', value: id, operator: '=' }] },
        { passwordHash: PasswordUtil.hashPassword(password) },
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Updates a user's password with old password verification.
   * @param id
   * @param oldPassword
   * @param password
   */
  async updatePasswordWithOldPasswordVerification(
    id: string,
    oldPassword: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();

    if (!PasswordUtil.verifyPassword(oldPassword, user.passwordHash)) {
      throw new Error('Incorrect old password');
    }

    return this.updatePassword(id, password);
  }
}
