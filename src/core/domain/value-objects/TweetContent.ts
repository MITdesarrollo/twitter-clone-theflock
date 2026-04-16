const MAX_LENGTH = 280;

export class TweetContent {
  private constructor(public readonly value: string) {}

  static create(raw: string): TweetContent {
    const trimmed = raw.trim();
    if (!trimmed) throw new Error('Tweet content is required');
    if (trimmed.length > MAX_LENGTH) throw new Error('Tweet must be 280 characters or less');
    return new TweetContent(trimmed);
  }
}
