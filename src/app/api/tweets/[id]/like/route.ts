import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaLikeRepository } from '@/infra/prisma/repositories/PrismaLikeRepository';
import { prisma } from '@/infra/prisma/client';
import { ToggleLike } from '@/core/use-cases/likes/ToggleLike';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const authService = new JoseAuthService();
    const payload = await authService.verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const likeRepo = new PrismaLikeRepository(prisma);
    const useCase = new ToggleLike(likeRepo);
    const result = await useCase.execute({ userId: payload.sub, tweetId: id });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
