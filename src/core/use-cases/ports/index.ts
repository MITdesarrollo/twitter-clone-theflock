export type { IUserRepository, CreateUserData } from './IUserRepository';
export type { IAuthService, TokenPayload } from './IAuthService';

export type {
  ITweetRepository,
  CreateTweetData,
  PaginationOptions,
  PaginatedTweets,
} from './ITweetRepository';

export type {
  IFollowRepository,
  FollowPaginationOptions,
  PaginatedUsers,
  FollowCounts,
} from './IFollowRepository';

export type { ILikeRepository, ToggleLikeResult } from './ILikeRepository';
