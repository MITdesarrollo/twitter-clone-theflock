import { NextResponse } from 'next/server';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { prisma } from '@/infra/prisma/client';
import { SearchUsers } from '@/core/use-cases/search/SearchUsers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? '';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    const userRepo = new PrismaUserRepository(prisma);
    const useCase = new SearchUsers(userRepo);
    const users = await useCase.execute({ query, limit });

    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
