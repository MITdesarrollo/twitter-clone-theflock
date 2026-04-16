import { NextResponse } from 'next/server';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { PrismaTweetRepository } from '@/infra/prisma/repositories/PrismaTweetRepository';
import { prisma } from '@/infra/prisma/client';
import { GetUserTweets } from '@/core/use-cases/tweets/GetUserTweets';

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params;
    const userRepo = new PrismaUserRepository(prisma);
    const user = await userRepo.findByUsername(username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') ?? undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const tweetRepo = new PrismaTweetRepository(prisma);
    const useCase = new GetUserTweets(tweetRepo);
    const result = await useCase.execute({ authorId: user.id, cursor, limit });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
