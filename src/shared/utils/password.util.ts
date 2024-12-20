import * as crypto from 'crypto';

export class PasswordUtil {
  private static readonly SALT_LENGTH = 16; // 16 bytes for salt
  private static readonly ITERATIONS = 10000; // Number of iterations
  private static readonly KEY_LENGTH = 64; // 64 bytes for hash
  private static readonly ALGORITHM = 'sha512'; // Using SHA-512

  static hashPassword(password: string): string {
    // Generate a random salt
    const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');

    // Generate hash using PBKDF2
    const hash = crypto
      .pbkdf2Sync(
        password,
        salt,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.ALGORITHM,
      )
      .toString('hex');

    // Return salt + hash combined
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    // Check if the stored hash contains the separator
    if (!storedHash.includes(':')) {
      throw new Error('Invalid hash format: missing separator');
    }

    // Split stored string to get salt and hash
    const [salt, hash] = storedHash.split(':');

    // Check lengths
    if (salt.length !== 32) {
      // 16 bytes in hex = 32 chars
      throw new Error('Invalid hash format: incorrect salt length');
    }
    if (hash.length !== 128) {
      // 64 bytes in hex = 128 chars
      throw new Error('Invalid hash format: incorrect hash length');
    }

    // Generate hash of input password using stored salt
    const inputHash = crypto
      .pbkdf2Sync(
        password,
        salt,
        this.ITERATIONS,
        this.KEY_LENGTH,
        this.ALGORITHM,
      )
      .toString('hex');

    // Compare hashes using timing-safe comparison
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(inputHash));
  }
}
