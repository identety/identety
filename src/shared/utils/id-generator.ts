import * as crypto from 'crypto';

interface GenerateOptions {
  length?: number; // Length of random part
  prefix?: string; // Prefix for the id
  separator?: string; // Separator between prefix and random
}

export class IdGenerator {
  // Generate client ID (shorter, url-safe)
  static generateClientId(options: GenerateOptions = {}): string {
    const { length = 24, prefix = 'client', separator = '_' } = options;

    const randomPart = crypto
      .randomBytes(length)
      .toString('base64url')
      .slice(0, length);

    return `${prefix}${separator}${randomPart}`;
  }

  // Generate client secret (longer, more secure)
  static generateClientSecret(options: GenerateOptions = {}): string {
    const { length = 55, prefix = 'secret', separator = '_' } = options;

    const randomPart = crypto
      .randomBytes(length)
      .toString('base64url')
      .slice(0, length);

    return `${prefix}${separator}${randomPart}`;
  }
}

// // Usage examples:
// const clientId = IdGenerator.generateClientId();
// // Result: "client_dBh7sK9aXpQr2Nt5mYw3jL8v"
//
// const clientSecret = IdGenerator.generateClientSecret();
// // Result: "secret_9aB2cD4eF5gH7iJ8kL0mN1oP2qR3sT4uV5wX6yZ"
//
// // With custom options
// const customId = IdGenerator.generateClientId({
//   prefix: 'm2m',
//   length: 16,
// });
// // Result: "m2m_7sK9aXpQr2Nt5mYw"
