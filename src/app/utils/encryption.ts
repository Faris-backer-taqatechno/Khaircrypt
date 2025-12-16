import crypto from 'crypto';

const ITERATIONS = 65536;
const KEY_LENGTH = 32; // 256 bits = 32 bytes
const IV_SIZE = 16; // 128 bits = 16 bytes
const DIGEST = 'sha256';
const ALGORITHM = 'aes-256-cbc';

/**
 * Generates the AES encryption key using PBKDF2.
 */
function generateKey(salt: string, secretKey: string): Buffer {
  return crypto.pbkdf2Sync(secretKey, salt, ITERATIONS, KEY_LENGTH, DIGEST);
}

/**
 * Encrypts data.
 * Returns Base64(IV + Ciphertext)
 */
export function encryptDataUtil(input: string, salt: string, secretKey: string): string {
  if (!input || !salt || !secretKey) {
    throw new Error('Input, salt, and secret key cannot be empty');
  }

  // Generate random IV
  const iv = crypto.randomBytes(IV_SIZE);

  // Derive key
  const key = generateKey(salt, secretKey);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt (default output is Buffer)
  let encrypted = cipher.update(input, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Combine IV + Encrypted Data
  const combined = Buffer.concat([iv, encrypted]);

  // Return Base64
  return combined.toString('base64');
}

/**
 * Decrypts data.
 * Input is Base64(IV + Ciphertext)
 */
export function decryptDataUtil(encryptedBase64: string, salt: string, secretKey: string): string {
  if (!encryptedBase64 || !salt || !secretKey) {
    throw new Error('Encrypted data, salt, and secret key cannot be empty');
  }

  // Decode Base64
  const combined = Buffer.from(encryptedBase64, 'base64');

  if (combined.length <= IV_SIZE) {
    throw new Error('Invalid encrypted data: too short');
  }

  // Extract IV
  const iv = combined.subarray(0, IV_SIZE);

  // Extract Ciphertext
  const encryptedBytes = combined.subarray(IV_SIZE);

  // Derive key
  const key = generateKey(salt, secretKey);

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  // Decrypt
  let decrypted = decipher.update(encryptedBytes);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
