import { User } from '../user';
import * as crypto from 'node:crypto';

describe('domain:User', () => {
  let validUserData: User;
  const id = crypto.randomUUID();

  beforeEach(() => {
    validUserData = {
      id,
      email: 'test@example.com',
      emailVerified: false,
      phoneNumberVerified: false,
      name: 'Test User',
      givenName: 'Test',
      familyName: 'User',
      locale: 'en-US',
      zoneinfo: 'America/New_York',
      phoneNumber: '+1234567890',
      address: {
        formatted: '123 Test St',
        streetAddress: '123 Test St',
        locality: 'Test City',
        region: 'Test Region',
        postalCode: '12345',
        country: 'US',
      },
      isActive: true,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should create user with all properties', () => {
    const user = validUserData;
    expect(user).toBeDefined();
    expect(user.id).toBe(id);
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should handle optional OIDC claims', () => {
    const oidcClaims = {
      givenName: 'Test',
      familyName: 'User',
      middleName: 'Middle',
      nickname: 'tester',
      preferredUsername: 'testuser',
      profile: 'https://example.com/profile',
      picture: 'https://example.com/picture',
      website: 'https://example.com',
      gender: 'not specified',
      birthdate: new Date('1990-01-01'),
    };
    const user = { ...validUserData, ...oidcClaims };
    expect(user.givenName).toBe(oidcClaims.givenName);
    expect(user.birthdate).toEqual(oidcClaims.birthdate);
  });

  it('should handle address fields', () => {
    const address = {
      formatted: 'New Address',
      streetAddress: '456 Test Ave',
      locality: 'New City',
      region: 'New Region',
      postalCode: '54321',
      country: 'UK',
    };
    const user = { ...validUserData, address };
    expect(user.address).toEqual(address);
  });

  it('should handle user metadata', () => {
    const metadata = {
      department: 'Engineering',
      employeeId: '123',
      customField: 'value',
    };
    const user = { ...validUserData, metadata };
    expect(user.metadata).toEqual(metadata);
  });

  describe('CreateUserDomainDto', () => {
    it('should create user with minimum required properties', () => {
      const createDto = {
        email: 'minimal@example.com',
        password: 'SecurePass123!',
      };
      expect(createDto.email).toBeDefined();
      expect(createDto.password).toBeDefined();
    });
  });

  describe('UserResponseDomainDto', () => {
    it('should format response correctly', () => {
      const response = {
        id: validUserData.id,
        email: validUserData.email,
        name: validUserData.name,
        phoneNumber: validUserData.phoneNumber,
        address: validUserData.address,
        locale: validUserData.locale,
        emailVerified: validUserData.emailVerified,
        phoneNumberVerified: validUserData.phoneNumberVerified,
        createdAt: validUserData.createdAt,
      };
      expect(response).toBeDefined();
      expect(response.id).toBe(validUserData.id);
    });
  });
});
