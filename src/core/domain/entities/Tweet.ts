export interface TweetAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface TweetProps {
  id: string;
  content: string;
  authorId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  author?: TweetAuthor;
  likeCount?: number;
}

export interface PublicTweet {
  id: string;
  content: string;
  authorId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: TweetAuthor | null;
  likeCount: number;
}

export class Tweet {
  private constructor(private readonly props: TweetProps) {}

  static create(props: TweetProps): Tweet {
    return new Tweet(props);
  }

  get id() {
    return this.props.id;
  }
  get content() {
    return this.props.content;
  }
  get authorId() {
    return this.props.authorId;
  }
  get parentId() {
    return this.props.parentId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get author() {
    return this.props.author;
  }
  get likeCount() {
    return this.props.likeCount ?? 0;
  }

  toPublic(): PublicTweet {
    return {
      id: this.id,
      content: this.content,
      authorId: this.authorId,
      parentId: this.parentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: this.author ?? null,
      likeCount: this.likeCount,
    };
  }
}
