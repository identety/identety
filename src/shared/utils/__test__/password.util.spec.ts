// src/utils/__tests__/password.util.spec.ts
import { PasswordUtil } from '../password.util';

describe('PasswordUtil', () => {
  describe('hashPassword', () => {
    it('should generate hash with salt in correct format', () => {
      const password = 'test123';
      const hash = PasswordUtil.hashPassword(password);

      // Check format (salt:hash)
      expect(hash).toContain(':');
      const [salt, hashPart] = hash.split(':');

      // Salt should be 32 chars (16 bytes in hex)
      expect(salt).toHaveLength(32);
      // Hash should be 128 chars (64 bytes in hex)
      expect(hashPart).toHaveLength(128);
    });

    it('should generate different hashes for same password', () => {
      const password = 'test123';

      const hash1 = PasswordUtil.hashPassword(password);
      const hash2 = PasswordUtil.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hashes for different passwords', () => {
      const hash1 = PasswordUtil.hashPassword('password1');
      const hash2 = PasswordUtil.hashPassword('password2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', () => {
      const password = 'myPassword123';
      const hash = PasswordUtil.hashPassword(password);

      expect(PasswordUtil.verifyPassword(password, hash)).toBe(true);
    });

    it('should reject incorrect password', () => {
      const hash = PasswordUtil.hashPassword('correctPassword');

      expect(PasswordUtil.verifyPassword('wrongPassword', hash)).toBe(false);
    });

    it('should be case sensitive', () => {
      const password = 'Password123';
      const hash = PasswordUtil.hashPassword(password);

      expect(PasswordUtil.verifyPassword('password123', hash)).toBe(false);
      expect(PasswordUtil.verifyPassword('PASSWORD123', hash)).toBe(false);
    });

    it('should reject if hash format is invalid', () => {
      expect(() => {
        PasswordUtil.verifyPassword('password', 'invalid-hash-format');
      }).toThrow();
    });

    it('should throw error if hash does not contain separator', () => {
      expect(() => {
        PasswordUtil.verifyPassword('password', 'invalidhashformat');
      }).toThrow('Invalid hash format: missing separator');
    });

    it('should throw error if salt length is incorrect', () => {
      expect(() => {
        PasswordUtil.verifyPassword('password', 'shortsalt:hash');
      }).toThrow('Invalid hash format: incorrect salt length');
    });

    it('should throw error if hash length is incorrect', () => {
      const salt = 'a'.repeat(32); // Correct salt length
      expect(() => {
        PasswordUtil.verifyPassword('password', `${salt}:shorthash`);
      }).toThrow('Invalid hash format: incorrect hash length');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      const hash = PasswordUtil.hashPassword('');
      expect(PasswordUtil.verifyPassword('', hash)).toBe(true);
      expect(PasswordUtil.verifyPassword('somepassword', hash)).toBe(false);
    });

    it('should handle special characters', () => {
      const password = '!@#$%^&*()_+';
      const hash = PasswordUtil.hashPassword(password);

      expect(PasswordUtil.verifyPassword(password, hash)).toBe(true);
    });

    it('should handle long passwords', () => {
      const longPassword = 'a'.repeat(1000);
      const hash = PasswordUtil.hashPassword(longPassword);

      expect(PasswordUtil.verifyPassword(longPassword, hash)).toBe(true);
    });

    it('should handle unicode characters', () => {
      const password = '密码123パスワード';
      const hash = PasswordUtil.hashPassword(password);

      expect(PasswordUtil.verifyPassword(password, hash)).toBe(true);
    });
  });
});
