import { NextResponse } from 'next/server';
import { GetCurrentUser } from '@/core/use-cases/auth/GetCurrentUser';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { prisma } from '@/infra/prisma/client';
import { getAuthToken } from '@/lib/auth/cookie';

export async function GET() {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const userRepo = new PrismaUserRepository(prisma);
  const authService = new JoseAuthService();
  const useCase = new GetCurrentUser(userRepo, authService);

  const user = await useCase.execute(token);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
