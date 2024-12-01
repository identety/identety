import { IdGeneratorUtil } from '../id-generator.util';

describe('IdGenerator', () => {
  describe('generateClientId', () => {
    it('should generate client ID with default options', () => {
      const clientId = IdGeneratorUtil.generateClientId();
      expect(clientId).toMatch(/^client_[A-Za-z0-9_-]{24}$/);
    });

    it('should generate client ID with custom length', () => {
      const clientId = IdGeneratorUtil.generateClientId({ length: 16 });
      expect(clientId).toMatch(/^client_[A-Za-z0-9_-]{16}$/);
    });

    it('should generate client ID with custom prefix', () => {
      const clientId = IdGeneratorUtil.generateClientId({ prefix: 'm2m' });
      expect(clientId).toMatch(/^m2m_[A-Za-z0-9_-]{24}$/);
    });

    it('should generate client ID with custom separator', () => {
      const clientId = IdGeneratorUtil.generateClientId({ separator: '-' });
      expect(clientId).toMatch(/^client-[A-Za-z0-9_-]{24}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = IdGeneratorUtil.generateClientId();
      const id2 = IdGeneratorUtil.generateClientId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateClientSecret', () => {
    it('should generate client secret with default options', () => {
      const secret = IdGeneratorUtil.generateClientSecret();
      expect(secret).toMatch(/^secret_[A-Za-z0-9_-]{55}$/);
    });

    it('should generate client secret with custom length', () => {
      const secret = IdGeneratorUtil.generateClientSecret({ length: 32 });
      expect(secret).toMatch(/^secret_[A-Za-z0-9_-]{32}$/);
    });

    it('should generate client secret with custom prefix', () => {
      const secret = IdGeneratorUtil.generateClientSecret({ prefix: 'key' });
      expect(secret).toMatch(/^key_[A-Za-z0-9_-]{55}$/);
    });

    it('should generate client secret with custom separator', () => {
      const secret = IdGeneratorUtil.generateClientSecret({ separator: ':' });
      expect(secret).toMatch(/^secret:[A-Za-z0-9_-]{55}$/);
    });

    it('should generate unique secrets', () => {
      const secret1 = IdGeneratorUtil.generateClientSecret();
      const secret2 = IdGeneratorUtil.generateClientSecret();
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('error cases', () => {
    it('should handle zero length', () => {
      const clientId = IdGeneratorUtil.generateClientId({ length: 0 });
      expect(clientId).toBe('client_');
    });

    it('should handle empty prefix', () => {
      const clientId = IdGeneratorUtil.generateClientId({ prefix: '' });
      expect(clientId).toMatch(/^_[A-Za-z0-9_-]{24}$/);
    });

    it('should handle empty separator', () => {
      const clientId = IdGeneratorUtil.generateClientId({ separator: '' });
      expect(clientId).toMatch(/^client[A-Za-z0-9_-]{24}$/);
    });
  });
});
