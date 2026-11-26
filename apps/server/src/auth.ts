import { createHash, timingSafeEqual } from 'node:crypto';

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export function safeEqual(received: string, expected: string): boolean {
  return timingSafeEqual(digest(received), digest(expected));
}

export function hasBearerToken(header: string | undefined, token: string): boolean {
  if (header === undefined || !header.startsWith('Bearer ')) {
    return false;
  }

  return safeEqual(header.slice('Bearer '.length), token);
}

export function hasBasicPassword(header: string | undefined, password: string): boolean {
  if (header === undefined || !header.startsWith('Basic ')) {
    return false;
  }

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
  const separator = decoded.indexOf(':');

  if (separator === -1) {
    return false;
  }

  return safeEqual(decoded.slice(separator + 1), password);
}
