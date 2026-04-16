import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';
import type { IAuthService } from '@/core/use-cases/ports/IAuthService';
import type { PublicUser } from '@/core/domain/entities/User';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: PublicUser;
  token: string;
}

export class LoginUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(input.email.trim().toLowerCase());
    if (!user) throw new Error('Invalid credentials');

    const valid = await this.authService.comparePassword(input.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const token = await this.authService.signToken({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return { user: user.toPublic(), token };
  }
}
