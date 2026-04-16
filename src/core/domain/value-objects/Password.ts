const MIN_LENGTH = 8;

export class Password {
  private constructor(public readonly value: string) {}

  static create(value: string): Password {
    if (!value) throw new Error('Password is required');
    if (value.length < MIN_LENGTH)
      throw new Error(`Password must be at least ${MIN_LENGTH} characters`);
    if (!/[A-Z]/.test(value))
      throw new Error('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(value))
      throw new Error('Password must contain at least one lowercase letter');
    if (!/\d/.test(value)) throw new Error('Password must contain at least one digit');
    return new Password(value);
  }
}
