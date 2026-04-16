import { jwtVerify } from 'jose';
import type { TokenPayload } from '@/core/use-cases/ports/IAuthService';

export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
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
