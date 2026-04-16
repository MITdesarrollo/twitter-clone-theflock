import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';
import type { PublicUser } from '@/core/domain/entities/User';

export interface SearchUsersInput {
  query: string;
  limit?: number;
}

export class SearchUsers {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: SearchUsersInput): Promise<PublicUser[]> {
    const trimmed = input.query.trim();
    if (!trimmed) return [];
    const users = await this.userRepo.search(trimmed, input.limit);
    return users.map((u) => u.toPublic());
  }
}
