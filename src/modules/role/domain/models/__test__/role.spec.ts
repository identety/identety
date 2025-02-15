// src/modules/role/domain/models/__test__/role.spec.ts
import { CreateRoleDto, Role, RoleResponseDto, UpdateRoleDto } from '../role';
import * as crypto from 'node:crypto';

describe('domain:Role', () => {
  let validRoleData: Role;
  const id = crypto.randomUUID();

  beforeEach(() => {
    validRoleData = {
      id,
      name: 'Test Role',
      description: 'Test Role Description',
      is_system: false,
      tenant_id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  describe('Role Model', () => {
    it('should create role with all properties', () => {
      const role = validRoleData;
      expect(role).toBeDefined();
      expect(role.id).toBe(id);
      expect(role.name).toBe('Test Role');
      expect(role.description).toBe('Test Role Description');
      expect(role.is_system).toBe(false);
      expect(role.tenant_id).toBeDefined();
      expect(role.created_at).toBeInstanceOf(Date);
      expect(role.updated_at).toBeInstanceOf(Date);
    });

    it('should create role without optional properties', () => {
      const roleWithoutOptional: Role = {
        id: crypto.randomUUID(),
        name: 'Basic Role',
        is_system: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(roleWithoutOptional).toBeDefined();
      expect(roleWithoutOptional.description).toBeUndefined();
      expect(roleWithoutOptional.tenant_id).toBeUndefined();
    });
  });

  describe('CreateRoleDto', () => {
    it('should create role with minimum required properties', () => {
      const createDto: CreateRoleDto = {
        name: 'Minimal Role',
      };

      expect(createDto.name).toBeDefined();
    });

    it('should create role with all optional properties', () => {
      const createDto: CreateRoleDto = {
        name: 'Full Role',
        description: 'Full Role Description',
        is_system: true,
        tenant_id: crypto.randomUUID(),
      };

      expect(createDto).toBeDefined();
      expect(createDto.name).toBe('Full Role');
      expect(createDto.description).toBe('Full Role Description');
      expect(createDto.is_system).toBe(true);
      expect(createDto.tenant_id).toBeDefined();
    });
  });

  describe('UpdateRoleDto', () => {
    it('should allow partial updates', () => {
      const updateDto: UpdateRoleDto = {
        name: 'Updated Role',
      };

      expect(updateDto.name).toBeDefined();
    });

    it('should allow updating multiple fields', () => {
      const updateDto: UpdateRoleDto = {
        name: 'Updated Role',
        description: 'Updated Description',
        is_system: true,
      };

      expect(updateDto.name).toBeDefined();
      expect(updateDto.description).toBeDefined();
      expect(updateDto.is_system).toBeDefined();
    });
  });

  describe('RoleResponseDto', () => {
    it('should format response correctly', () => {
      const response: RoleResponseDto = {
        id: validRoleData.id,
        name: validRoleData.name,
        description: validRoleData.description,
        is_system: validRoleData.is_system,
        created_at: validRoleData.created_at,
        updated_at: validRoleData.updated_at,
      };

      expect(response).toBeDefined();
      expect(response.id).toBe(validRoleData.id);
    });
  });
});
