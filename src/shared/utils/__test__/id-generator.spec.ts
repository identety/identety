import { IdGenerator } from '../id-generator';

describe('IdGenerator', () => {
  describe('generateClientId', () => {
    it('should generate client ID with default options', () => {
      const clientId = IdGenerator.generateClientId();
      expect(clientId).toMatch(/^client_[A-Za-z0-9_-]{24}$/);
    });

    it('should generate client ID with custom length', () => {
      const clientId = IdGenerator.generateClientId({ length: 16 });
      expect(clientId).toMatch(/^client_[A-Za-z0-9_-]{16}$/);
    });

    it('should generate client ID with custom prefix', () => {
      const clientId = IdGenerator.generateClientId({ prefix: 'm2m' });
      expect(clientId).toMatch(/^m2m_[A-Za-z0-9_-]{24}$/);
    });

    it('should generate client ID with custom separator', () => {
      const clientId = IdGenerator.generateClientId({ separator: '-' });
      expect(clientId).toMatch(/^client-[A-Za-z0-9_-]{24}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = IdGenerator.generateClientId();
      const id2 = IdGenerator.generateClientId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateClientSecret', () => {
    it('should generate client secret with default options', () => {
      const secret = IdGenerator.generateClientSecret();
      expect(secret).toMatch(/^secret_[A-Za-z0-9_-]{55}$/);
    });

    it('should generate client secret with custom length', () => {
      const secret = IdGenerator.generateClientSecret({ length: 32 });
      expect(secret).toMatch(/^secret_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate client secret with custom prefix', () => {
      const secret = IdGenerator.generateClientSecret({ prefix: 'key' });
      expect(secret).toMatch(/^key_[A-Za-z0-9_-]{55}$/);
    });

    it('should generate client secret with custom separator', () => {
      const secret = IdGenerator.generateClientSecret({ separator: ':' });
      expect(secret).toMatch(/^secret:[A-Za-z0-9_-]{55}$/);
    });

    it('should generate unique secrets', () => {
      const secret1 = IdGenerator.generateClientSecret();
      const secret2 = IdGenerator.generateClientSecret();
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('error cases', () => {
    it('should handle zero length', () => {
      const clientId = IdGenerator.generateClientId({ length: 0 });
      expect(clientId).toBe('client_');
    });

    it('should handle empty prefix', () => {
      const clientId = IdGenerator.generateClientId({ prefix: '' });
      expect(clientId).toMatch(/^_[A-Za-z0-9_-]{24}$/);
    });

    it('should handle empty separator', () => {
      const clientId = IdGenerator.generateClientId({ separator: '' });
      expect(clientId).toMatch(/^client[A-Za-z0-9_-]{24}$/);
    });
  });
});
