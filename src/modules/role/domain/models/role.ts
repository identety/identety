export interface Role {
  id: string;
  tenant_id?: string; // Optional for multi-tenancy support

  // Core properties
  name: string;
  description?: string;

  // System flag to identify built-in roles
  is_system: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// For creating a new role
export interface CreateRoleDto {
  name: string;
  description?: string;
  is_system?: boolean;
  tenant_id?: string;
}

// For updating an existing role
// Allows partial updates of everything except tenant_id
export interface UpdateRoleDto
  extends Partial<Omit<CreateRoleDto, 'tenant_id'>> {}

// For API responses
export interface RoleResponseDto extends Omit<Role, 'tenant_id'> {
  id: string;
  name: string;
  description?: string;
  is_system: boolean;
  created_at: Date;
  updated_at: Date;
}
