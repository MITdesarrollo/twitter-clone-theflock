import { notFound } from 'next/navigation';
import { PrismaTweetRepository } from '@/infra/prisma/repositories/PrismaTweetRepository';
import { prisma } from '@/infra/prisma/client';
import { GetTweetWithReplies } from '@/core/use-cases/tweets/GetTweetWithReplies';
import { TweetThread } from '@/components/tweets/TweetThread';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TweetDetailPage({ params }: Props) {
  const { id } = await params;
  const tweetRepo = new PrismaTweetRepository(prisma);
  const useCase = new GetTweetWithReplies(tweetRepo);
  const result = await useCase.execute({ tweetId: id });

  if (!result) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            &larr;
          </Link>
          <h2 className="text-lg font-bold">Thread</h2>
        </div>
      </div>
      <TweetThread
        tweet={result.tweet}
        initialReplies={result.replies}
        initialNextCursor={result.nextCursor}
      />
    </div>
  );
}
