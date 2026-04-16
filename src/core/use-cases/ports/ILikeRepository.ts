export interface ToggleLikeResult {
  liked: boolean;
  likeCount: number;
}

export interface ILikeRepository {
  toggleLike(userId: string, tweetId: string): Promise<ToggleLikeResult>;
  getLikeCount(tweetId: string): Promise<number>;
  isLikedBy(userId: string, tweetId: string): Promise<boolean>;
  getLikedTweetIds(userId: string, tweetIds: string[]): Promise<string[]>;
}
