import { Injectable } from '@nestjs/common';
import { PasswordUtil } from '@/shared/utils/password.util';
import { UserRepository } from '../ports/user.repository';
import { CreateUserDto, User } from '../../domain/models/user';
import { UserListQueryDto } from '@/modules/user/interface/http/dtos/user.dto';
import {
  AppDuplicateException,
  AppNotFoundException,
} from '@/shared/application/exceptions/appException';

@Injectable()
export class UserService {
  constructor(public readonly userRepository: UserRepository) {}

  /**
   * Finds a user by its ID.
   * @param id
   */
  async findById(id: string) {
    const [user] = await this.userRepository.findRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
      limit: 1,
    });

    if (!user) throw new AppNotFoundException();

    return user;
  }

  /**
   * Finds a user by its email.
   * @param email
   */
  async findByEmail(email: string): Promise<User> {
    const [user] = await this.userRepository.findRows({
      filters: [{ key: 'email', operator: '=', value: email }],
    });

    if (!user) {
      throw new AppNotFoundException();
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
    const [existedUser] = await this.userRepository.findRows({
      filters: [{ key: 'email', value: payload.email, operator: '=' }],
      limit: 1,
    });

    if (existedUser) {
      throw new AppDuplicateException('User already exists');
    }

    if (payload.password) {
      payload['passwordHash'] = PasswordUtil.hashPassword(payload.password);
      delete payload?.password;
    }

    const result = await this.userRepository.createOne(payload);
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
    if (!user) throw new AppNotFoundException();

    return this.userRepository.updateOne(
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
    if (!user) throw new AppNotFoundException();

    const result = await this.userRepository.deleteRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
    });
    return result?.[0];
  }

  /**
   * Updates a user's password.
   * @param id
   * @param password
   */
  async updatePassword(id: string, password: string): Promise<boolean> {
    try {
      await this.userRepository.updateOne(
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
    if (!user) throw new AppNotFoundException();

    if (!PasswordUtil.verifyPassword(oldPassword, user.passwordHash)) {
      throw new Error('Incorrect old password');
    }

    return this.updatePassword(id, password);
  }

  /**
   * Finds all users with pagination.
   * @param queries
   */
  async getUsersWithPagination(queries: UserListQueryDto) {
    const defaultSortBy = 'created_at';
    const defaultSort = 'DESC';

    const defaultColumns = [
      'id',
      'name',
      'email',
      'email_verified',
      'phone_number_verified',
      'created_at',
    ];

    return this.userRepository.findAllWithPagination({
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
}
