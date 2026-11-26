import { describe, expect, it } from 'vitest';
import { hasBasicPassword, hasBearerToken } from './auth.ts';

function basic(credentials: string): string {
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

describe('hasBearerToken', () => {
  it('accepts the exact token', () => {
    expect(hasBearerToken('Bearer secret', 'secret')).toBe(true);
  });

  it('rejects a missing, wrong or differently shaped header', () => {
    expect(hasBearerToken(undefined, 'secret')).toBe(false);
    expect(hasBearerToken('Bearer secre', 'secret')).toBe(false);
    expect(hasBearerToken('secret', 'secret')).toBe(false);
    expect(hasBearerToken(basic('any:secret'), 'secret')).toBe(false);
  });
});

describe('hasBasicPassword', () => {
  it('accepts the password with any user name', () => {
    expect(hasBasicPassword(basic('fleet:open sesame'), 'open sesame')).toBe(true);
    expect(hasBasicPassword(basic(':open sesame'), 'open sesame')).toBe(true);
  });

  it('keeps colons that are part of the password', () => {
    expect(hasBasicPassword(basic('fleet:a:b'), 'a:b')).toBe(true);
  });

  it('rejects a missing header, a wrong password or no separator', () => {
    expect(hasBasicPassword(undefined, 'open sesame')).toBe(false);
    expect(hasBasicPassword(basic('fleet:wrong'), 'open sesame')).toBe(false);
    expect(hasBasicPassword(basic('open sesame'), 'open sesame')).toBe(false);
    expect(hasBasicPassword('Bearer open sesame', 'open sesame')).toBe(false);
  });
});
