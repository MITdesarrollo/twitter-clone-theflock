import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { PrismaFollowRepository } from '@/infra/prisma/repositories/PrismaFollowRepository';
import { prisma } from '@/infra/prisma/client';
import { GetFollowStatus } from '@/core/use-cases/follow/GetFollowStatus';

async function tryGetAuthPayload() {
  try {
    const token = await getAuthToken();
    if (!token) return null;
    const authService = new JoseAuthService();
    return authService.verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const userRepo = new PrismaUserRepository(prisma);
    const profileUser = await userRepo.findByUsername(username);
    if (!profileUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const payload = await tryGetAuthPayload();
    const followRepo = new PrismaFollowRepository(prisma);
    const useCase = new GetFollowStatus(followRepo);
    const result = await useCase.execute({
      profileUserId: profileUser.id,
      currentUserId: payload?.sub,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
