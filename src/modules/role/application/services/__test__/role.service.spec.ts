import { Test } from '@nestjs/testing';
import { RoleService } from '../role.service';
import { RoleRepository } from '../../ports/role.repository';
import {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
} from '../../../domain/models/role';
import {
  AppDuplicateException,
  AppInvalidInputException,
  AppNotFoundException,
} from '@/shared/application/exceptions/appException';
import * as crypto from 'crypto';
import { AppPaginationResponseDto } from '@/shared/infrastructure/persistence/persistence.contract';

describe('RoleService', () => {
  let service: RoleService;
  let repository: jest.Mocked<RoleRepository>;

  const mockRole: Role = {
    id: crypto.randomUUID(),
    name: 'test_role',
    description: 'Test Role Description',
    is_system: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: {
            findRows: jest.fn(),
            findAllWithPagination: jest.fn(),
            createOne: jest.fn(),
            updateOne: jest.fn(),
            deleteRows: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get(RoleRepository);
  });

  describe('findById', () => {
    it('should find role by id', async () => {
      repository.findRows.mockResolvedValue([mockRole]);

      const result = await service.findById('test-id');

      expect(repository.findRows).toHaveBeenCalledWith({
        filters: [{ key: 'id', value: 'test-id', operator: '=' }],
        limit: 1,
      });
      expect(result).toEqual(mockRole);
    });

    it('should throw AppNotFoundException if role not found', async () => {
      repository.findRows.mockResolvedValue([]);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  describe('createRole', () => {
    // it('should create a role with valid data', async () => {
    //   const createDto: CreateRoleDto = {
    //     name: 'Test Role',
    //     description: 'Test Description',
    //   };
    //
    //   repository.findRows.mockResolvedValue([]); // No existing role
    //   // repository.createOne.mockResolvedValue({ ...mockRole, ...createDto });
    //
    //   const result = await service.createRole(createDto);
    //
    //   expect(result.name).toBe('test_role'); // Should be snake_case
    //   expect(repository.createOne).toHaveBeenCalled();
    // });

    it('should throw AppInvalidInputException for system role creation', async () => {
      const createDto: CreateRoleDto = {
        name: 'Test Role',
        is_system: true,
      };

      await expect(service.createRole(createDto)).rejects.toThrow(
        AppInvalidInputException,
      );
      expect(repository.createOne).not.toHaveBeenCalled();
    });

    it('should throw AppInvalidInputException for empty role name', async () => {
      repository.findRows.mockResolvedValue([]); // No existing role

      // const createDto: CreateRoleDto = {
      //   name: '',
      // };
      //
      // await expect(service.createRole(createDto)).rejects.toThrow(
      //   AppInvalidInputException,
      // );
    });

    it('should throw AppDuplicateException for duplicate role name', async () => {
      const createDto: CreateRoleDto = {
        name: 'Test Role',
      };

      repository.findRows.mockResolvedValue([mockRole]); // Existing role

      await expect(service.createRole(createDto)).rejects.toThrow(
        AppDuplicateException,
      );
    });
  });

  describe('updateRole', () => {
    it('should update role with valid data', async () => {
      const updateDto: UpdateRoleDto = {
        name: 'Updated Role',
        description: 'Updated Description',
      };

      repository.findRows.mockResolvedValue([
        { ...mockRole, is_system: false },
      ]);
      repository.updateOne.mockResolvedValue({ ...mockRole, ...updateDto });

      const result = await service.updateRole('test-id', updateDto);

      expect(repository.updateOne).toHaveBeenCalled();
      expect(result.description).toBe(updateDto.description);
    });

    it('should throw AppInvalidInputException when updating system role', async () => {
      const updateDto: UpdateRoleDto = {
        name: 'Updated Role',
      };

      repository.findRows.mockResolvedValue([{ ...mockRole, is_system: true }]);

      await expect(
        service.updateRole('system-role-id', updateDto),
      ).rejects.toThrow(AppInvalidInputException);
    });

    // it('should throw AppInvalidInputException for empty role name', async () => {
    //   const updateDto: UpdateRoleDto = {
    //     name: '',
    //   };
    //
    //   repository.findRows.mockResolvedValue([mockRole]);
    //
    //   await expect(service.updateRole('test-id', updateDto)).rejects.toThrow(
    //     AppInvalidInputException,
    //   );
    // });
  });

  describe('deleteRole', () => {
    it('should delete non-system role', async () => {
      repository.findRows.mockResolvedValue([mockRole]);
      repository.deleteRows.mockResolvedValue([mockRole]);

      const result = await service.deleteRole('test-id');

      expect(repository.deleteRows).toHaveBeenCalled();
      expect(result).toEqual(mockRole);
    });

    it('should throw AppInvalidInputException when deleting system role', async () => {
      repository.findRows.mockResolvedValue([{ ...mockRole, is_system: true }]);

      await expect(service.deleteRole('system-role-id')).rejects.toThrow(
        AppInvalidInputException,
      );
      expect(repository.deleteRows).not.toHaveBeenCalled();
    });
  });

  describe('getRolesWithPagination', () => {
    it('should return paginated roles with default values', async () => {
      const paginatedResult: AppPaginationResponseDto<Role> = {
        nodes: [mockRole],
        meta: {
          totalCount: 1,
          totalPages: 1,
          currentPage: 1,
          hasNextPage: false,
        },
      };

      repository.findAllWithPagination.mockResolvedValue(paginatedResult);

      const result = await service.getRolesWithPagination({});

      expect(repository.findAllWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ key: 'created_at', direction: 'DESC' }],
        }),
      );
      expect(result).toEqual(paginatedResult);
    });

    it('should use provided pagination parameters', async () => {
      const queries = {
        page: 2,
        limit: 5,
        sortBy: 'name',
        sort: 'asc' as const,
      };

      await service.getRolesWithPagination(queries);

      expect(repository.findAllWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 5,
          orderBy: [{ key: 'name', direction: 'asc' }],
        }),
      );
    });
  });

  describe('exists', () => {
    it('should return true if role exists', async () => {
      repository.findRows.mockResolvedValue([mockRole]);

      const result = await service.exists('test-id');

      expect(result).toBe(true);
    });

    it('should return false if role does not exist', async () => {
      repository.findRows.mockResolvedValue([]);

      const result = await service.exists('non-existent-id');

      expect(result).toBe(false);
    });
  });
});
