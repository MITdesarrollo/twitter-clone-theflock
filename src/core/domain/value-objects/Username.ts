const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 20;

export class Username {
  private constructor(public readonly value: string) {}

  static create(value: string): Username {
    const trimmed = value.trim();
    if (!trimmed) throw new Error('Username is required');
    if (trimmed.length < MIN_LENGTH)
      throw new Error(`Username must be at least ${MIN_LENGTH} characters`);
    if (trimmed.length > MAX_LENGTH)
      throw new Error(`Username must be at most ${MAX_LENGTH} characters`);
    if (!USERNAME_REGEX.test(trimmed))
      throw new Error('Username can only contain letters, numbers, and underscores');
    return new Username(trimmed);
  }
}
