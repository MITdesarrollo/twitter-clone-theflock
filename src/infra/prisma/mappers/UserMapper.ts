import { User } from '@/core/domain/entities/User';
import type { User as PrismaUser } from '@/generated/prisma/client';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      username: prismaUser.username,
      displayName: prismaUser.displayName,
      bio: prismaUser.bio,
      avatarUrl: prismaUser.avatarUrl,
      passwordHash: prismaUser.passwordHash,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }
}
