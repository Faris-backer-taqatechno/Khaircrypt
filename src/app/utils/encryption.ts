import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ITERATIONS = 65536;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

function deriveKey(secret: string, salt: string): Buffer {
  return crypto.pbkdf2Sync(secret, salt, ITERATIONS, KEY_LENGTH, DIGEST);
}

export function encrypt(text: string, companyId: string, secretKey: string): string {
  const key = deriveKey(secretKey, companyId);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Combine IV and encrypted data (IV is usually needed for decryption)
  const result = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);
  return result.toString('base64');
}

export function decrypt(encryptedBase64: string, companyId: string, secretKey: string): string {
  const key = deriveKey(secretKey, companyId);

  const inputBuffer = Buffer.from(encryptedBase64, 'base64');

  // Extract IV (first 16 bytes)
  const iv = inputBuffer.subarray(0, 16);
  const encryptedText = inputBuffer.subarray(16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}
