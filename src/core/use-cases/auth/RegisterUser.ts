import { Email } from '@/core/domain/value-objects/Email';
import { Username } from '@/core/domain/value-objects/Username';
import { Password } from '@/core/domain/value-objects/Password';
import type { IUserRepository } from '@/core/use-cases/ports/IUserRepository';
import type { IAuthService } from '@/core/use-cases/ports/IAuthService';
import type { PublicUser } from '@/core/domain/entities/User';

export interface RegisterInput {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface RegisterResult {
  user: PublicUser;
  token: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const email = Email.create(input.email);
    const username = Username.create(input.username);
    Password.create(input.password);

    const existingByEmail = await this.userRepo.findByEmail(email.value);
    if (existingByEmail) throw new Error('Email already in use');

    const existingByUsername = await this.userRepo.findByUsername(username.value);
    if (existingByUsername) throw new Error('Username already taken');

    const passwordHash = await this.authService.hashPassword(input.password);

    const user = await this.userRepo.create({
      email: email.value,
      username: username.value,
      displayName: input.displayName.trim(),
      passwordHash,
    });

    const token = await this.authService.signToken({
      sub: user.id,
      username: user.username,
      email: user.email,
    });

    return { user: user.toPublic(), token };
  }
}
