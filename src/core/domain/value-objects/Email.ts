const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) throw new Error('Email is required');
    if (!EMAIL_REGEX.test(trimmed)) throw new Error('Invalid email format');
    return new Email(trimmed);
  }
}
