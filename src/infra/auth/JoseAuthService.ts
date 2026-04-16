import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { IAuthService, TokenPayload } from '@/core/use-cases/ports/IAuthService';

const COST_FACTOR = 12;
const TOKEN_EXPIRY = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
}

export class JoseAuthService implements IAuthService {
  async signToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ username: payload.username, email: payload.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(payload.sub)
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(getSecret());
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      if (!payload.sub || !payload.username || !payload.email) return null;
      return {
        sub: payload.sub,
        username: payload.username as string,
        email: payload.email as string,
      };
    } catch {
      return null;
    }
  }

  async hashPassword(raw: string): Promise<string> {
    return bcrypt.hash(raw, COST_FACTOR);
  }

  async comparePassword(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
}
