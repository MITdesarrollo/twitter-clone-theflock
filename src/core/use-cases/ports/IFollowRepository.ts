import type { PublicUser } from '@/core/domain/entities/User';

export interface FollowPaginationOptions {
  cursor?: string;
  limit?: number;
}

export interface PaginatedUsers {
  users: PublicUser[];
  nextCursor: string | null;
}

export interface FollowCounts {
  followersCount: number;
  followingCount: number;
}

export interface IFollowRepository {
  follow(followerId: string, followingId: string): Promise<void>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string, options?: FollowPaginationOptions): Promise<PaginatedUsers>;
  getFollowing(userId: string, options?: FollowPaginationOptions): Promise<PaginatedUsers>;
  getFollowCounts(userId: string): Promise<FollowCounts>;
}
