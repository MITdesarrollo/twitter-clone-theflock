import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaTweetRepository } from '@/infra/prisma/repositories/PrismaTweetRepository';
import { prisma } from '@/infra/prisma/client';
import { DeleteTweet } from '@/core/use-cases/tweets/DeleteTweet';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const authService = new JoseAuthService();
    const payload = await authService.verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { id } = await params;
    const tweetRepo = new PrismaTweetRepository(prisma);
    const useCase = new DeleteTweet(tweetRepo);
    await useCase.execute({ tweetId: id, requestingUserId: payload.sub });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'Tweet not found') {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
