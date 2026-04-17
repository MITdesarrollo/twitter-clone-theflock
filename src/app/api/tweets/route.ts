import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { PrismaTweetRepository } from '@/infra/prisma/repositories/PrismaTweetRepository';
import { prisma } from '@/infra/prisma/client';
import { CreateTweet } from '@/core/use-cases/tweets/CreateTweet';
import { GetTimeline } from '@/core/use-cases/tweets/GetTimeline';
import { createTweetSchema } from '@/lib/validations/tweets';

async function getAuthPayload() {
  const token = await getAuthToken();
  if (!token) return null;
  const authService = new JoseAuthService();
  return authService.verifyToken(token);
}

export async function POST(request: Request) {
  try {
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const parsed = createTweetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const tweetRepo = new PrismaTweetRepository(prisma);
    const useCase = new CreateTweet(tweetRepo);
    const tweet = await useCase.execute({
      authorId: payload.sub,
      content: parsed.data.content,
      parentId: parsed.data.parentId,
    });
    return NextResponse.json({ tweet }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const tweetRepo = new PrismaTweetRepository(prisma);
    const useCase = new GetTimeline(tweetRepo);
    const result = await useCase.execute({ userId: payload.sub, cursor, limit });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
