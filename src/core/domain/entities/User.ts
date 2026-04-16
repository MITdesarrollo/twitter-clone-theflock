export interface UserProps {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get username() {
    return this.props.username;
  }
  get displayName() {
    return this.props.displayName;
  }
  get bio() {
    return this.props.bio ?? null;
  }
  get avatarUrl() {
    return this.props.avatarUrl ?? null;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  toPublic(): PublicUser {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      displayName: this.displayName,
      bio: this.bio,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
    };
  }
}
