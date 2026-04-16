import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaLikeRepository } from '@/infra/prisma/repositories/PrismaLikeRepository';
import { prisma } from '@/infra/prisma/client';

export async function GET(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const authService = new JoseAuthService();
    const payload = await authService.verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];

    if (ids.length === 0) {
      return NextResponse.json({ likedIds: [] });
    }

    const likeRepo = new PrismaLikeRepository(prisma);
    const likedIds = await likeRepo.getLikedTweetIds(payload.sub, ids);

    return NextResponse.json({ likedIds });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
