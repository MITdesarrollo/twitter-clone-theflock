import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { PrismaFollowRepository } from '@/infra/prisma/repositories/PrismaFollowRepository';
import { prisma } from '@/infra/prisma/client';
import { ToggleFollow } from '@/core/use-cases/follow/ToggleFollow';

async function getAuthPayload() {
  const token = await getAuthToken();
  if (!token) return null;
  const authService = new JoseAuthService();
  return authService.verifyToken(token);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { username } = await params;
    const userRepo = new PrismaUserRepository(prisma);
    const targetUser = await userRepo.findByUsername(username);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const followRepo = new PrismaFollowRepository(prisma);
    const useCase = new ToggleFollow(followRepo);
    const result = await useCase.execute({
      followerId: payload.sub,
      followingId: targetUser.id,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Cannot follow yourself' ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
