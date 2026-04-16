export interface TokenPayload {
  sub: string;
  username: string;
  email: string;
}

export interface IAuthService {
  signToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
  hashPassword(raw: string): Promise<string>;
  comparePassword(raw: string, hash: string): Promise<boolean>;
}
