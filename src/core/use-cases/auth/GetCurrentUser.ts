import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';
import type { IAuthService } from '@/core/use-cases/ports/IAuthService';
import type { PublicUser } from '@/core/domain/entities/User';

export class GetCurrentUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(token: string): Promise<PublicUser | null> {
    const payload = await this.authService.verifyToken(token);
    if (!payload) return null;

    const user = await this.userRepo.findById(payload.sub);
    if (!user) return null;

    return user.toPublic();
  }
}
