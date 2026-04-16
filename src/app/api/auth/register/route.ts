import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { RegisterUser } from '@/core/use-cases/auth/RegisterUser';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { prisma } from '@/infra/prisma/client';
import { setAuthCookie } from '@/lib/auth/cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userRepo = new PrismaUserRepository(prisma);
    const authService = new JoseAuthService();
    const useCase = new RegisterUser(userRepo, authService);

    const { user, token } = await useCase.execute(parsed.data);
    await setAuthCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Email already in use' || message === 'Username already taken') {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
