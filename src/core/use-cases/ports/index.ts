export type { IUserRepository, CreateUserData } from './IUserRepository';
export type { IAuthService, TokenPayload } from './IAuthService';

export type {
  ITweetRepository,
  CreateTweetData,
  PaginationOptions,
  PaginatedTweets,
} from './ITweetRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ILikeRepository {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IFollowRepository {}
