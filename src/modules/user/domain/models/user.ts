// Core User Model
export interface User {
  id: string;
  tenantId?: string; // Optional, for cloud version

  // OIDC Standard Claims
  // Profile
  name?: string; // Full name
  givenName?: string; // First name
  familyName?: string; // Last name
  middleName?: string; // Middle name
  nickname?: string; // Casual name
  preferredUsername?: string; // Preferred username
  profile?: string; // Profile page URL
  picture?: string; // Profile picture URL
  website?: string; // Web page or blog
  gender?: string; // Gender
  birthdate?: Date; // Birthday
  zoneinfo?: string; // Time zone
  locale?: string; // Locale

  // Email
  email: string; // Email address
  emailVerified: boolean; // Email verification status

  // Phone
  phoneNumber?: string;
  phoneNumberVerified: boolean;

  // Address (structured format)
  address?: UserAddress;

  // Security & State
  passwordHash?: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  formatted?: string; // Full address
  streetAddress?: string; // Street address
  locality?: string; // City/Town
  region?: string; // State/Province
  postalCode?: string; // ZIP/Postal code
  country?: string; // Country
}

//------------------------------------------------------------------------------
// Dtos
//------------------------------------------------------------------------------

type OmittedUserFields =
  | 'passwordHash'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'emailVerified'
  | 'isActive';

export interface CreateUserDto extends Partial<Omit<User, OmittedUserFields>> {}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
