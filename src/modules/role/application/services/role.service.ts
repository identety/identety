import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../ports/role.repository';
import { CreateRoleDto, Role, UpdateRoleDto } from '../../domain/models/role';
import {
  AppDuplicateException,
  AppInvalidInputException,
  AppNotAllowedException,
  AppNotFoundException,
} from '@/shared/application/exceptions/appException';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  /**
   * Find role by ID
   */
  async findById(id: string): Promise<Role> {
    const [role] = await this.repository.findRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
      limit: 1,
    });

    if (!role) {
      throw new AppNotFoundException('Role not found');
    }

    return role;
  }

  /**
   * Get roles with pagination
   */
  async getRolesWithPagination(queries: {
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
    sortBy?: string;
    columns?: string[];
  }) {
    const defaultSortBy = 'created_at';
    const defaultSort = 'DESC';

    const defaultColumns = [
      'id',
      'name',
      'description',
      'is_system',
      'created_at',
    ];

    return this.repository.findAllWithPagination({
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

  /**
   * Create new role
   */
  async createRole(payload: CreateRoleDto): Promise<Role> {
    // Check if system role creation is allowed
    if (payload.is_system) {
      throw new AppNotAllowedException('Cannot create system roles manually');
    }

    // Validate role name is not empty
    if (!Boolean(payload.name?.trim())) {
      throw new AppInvalidInputException('Role name is required');
    }

    // make role name snake case
    payload.name = payload.name.toLowerCase().replace(/ /g, '_');

    // role name should be unique in the tenant
    const [existingRole] = await this.repository.findRows({
      filters: [{ key: 'name', value: payload.name, operator: '=' }],
      limit: 1,
    });
    if (existingRole) {
      throw new AppDuplicateException('Role name already exists');
    }

    // Create role
    return this.repository.createOne(payload);
  }

  /**
   * Update role
   */
  async updateRole(id: string, payload: UpdateRoleDto): Promise<Role> {
    // Find role first
    const role = await this.findById(id);

    // Don't allow updating system roles
    if (role.is_system) {
      throw new AppInvalidInputException('System roles cannot be modified');
    }

    // If name is being updated, validate it
    if (payload.name && !payload.name.trim()) {
      throw new AppInvalidInputException('Role name cannot be empty');
    }

    // trim and lowercase name if provided
    if (payload?.name) {
      payload.name = payload?.name?.trim().split(' ').join('_').toLowerCase();
    }

    return this.repository.updateOne(
      { filters: [{ key: 'id', value: id, operator: '=' }] },
      payload,
    );
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<Role> {
    // Find role first
    const role = await this.findById(id);

    // Don't allow deleting system roles
    if (role.is_system) {
      throw new AppInvalidInputException('System roles cannot be deleted');
    }

    // Delete role
    const [deletedRole] = await this.repository.deleteRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
    });

    return deletedRole;
  }

  /**
   * Get role by name
   */
  async findByName(name: string): Promise<Role | null> {
    const [role] = await this.repository.findRows({
      filters: [{ key: 'name', value: name, operator: '=' }],
      limit: 1,
    });

    return role || null;
  }

  /**
   * Check if role exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const [role] = await this.repository.findRows({
      filters: [{ key: 'id', value: id, operator: '=' }],
      limit: 1,
    });

    return !!role;
  }
}
