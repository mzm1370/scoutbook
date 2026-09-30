import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';

const VERSION = 'v1';
const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const KEY_HEX_LEN = 64;

export function parseEncryptionKey(hex: string | undefined): Buffer {
  if (!hex || hex.length !== KEY_HEX_LEN || !/^[0-9a-fA-F]+$/.test(hex)) {
    throw new BadRequestException(
      'DOCS_SYNC_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
    );
  }
  return Buffer.from(hex, 'hex');
}

/** Format: v1:<ivHex>:<tagHex>:<cipherHex> */
export function encryptToken(plaintext: string, keyHex: string): string {
  const key = parseEncryptionKey(keyHex);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    VERSION,
    iv.toString('hex'),
    tag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

export function decryptToken(blob: string, keyHex: string): string {
  const key = parseEncryptionKey(keyHex);
  const parts = blob.split(':');
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new BadRequestException('Stored token ciphertext is invalid');
  }
  const [, ivHex, tagHex, cipherHex] = parts;
  if (!ivHex || !tagHex || !cipherHex) {
    throw new BadRequestException('Stored token ciphertext is invalid');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const data = Buffer.from(cipherHex, 'hex');
  if (iv.length !== IV_LEN || tag.length !== TAG_LEN) {
    throw new BadRequestException('Stored token ciphertext is invalid');
  }
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    'utf8',
  );
}

export function tokenLastFour(token: string): string {
  const trimmed = token.trim();
  if (trimmed.length < 4) return trimmed.padStart(4, '*');
  return trimmed.slice(-4);
}
