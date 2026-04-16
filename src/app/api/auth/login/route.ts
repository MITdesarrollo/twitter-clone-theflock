import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { LoginUser } from '@/core/use-cases/auth/LoginUser';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { prisma } from '@/infra/prisma/client';
import { setAuthCookie } from '@/lib/auth/cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const userRepo = new PrismaUserRepository(prisma);
    const authService = new JoseAuthService();
    const useCase = new LoginUser(userRepo, authService);

    const { user, token } = await useCase.execute(parsed.data);
    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message === 'Invalid credentials') {
      return NextResponse.json({ error: message }, { status: 401 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
