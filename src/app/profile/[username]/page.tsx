import { notFound } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { PrismaFollowRepository } from '@/infra/prisma/repositories/PrismaFollowRepository';
import { prisma } from '@/infra/prisma/client';
import { GetFollowStatus } from '@/core/use-cases/follow/GetFollowStatus';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/follow/FollowButton';
import { getAuthToken } from '@/lib/auth/cookie';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';

interface Props {
  params: Promise<{ username: string }>;
}

async function tryGetCurrentUserId(): Promise<string | undefined> {
  try {
    const token = await getAuthToken();
    if (!token) return undefined;
    const authService = new JoseAuthService();
    const payload = await authService.verifyToken(token);
    return payload?.sub;
  } catch {
    return undefined;
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const userRepo = new PrismaUserRepository(prisma);
  const user = await userRepo.findByUsername(username);

  if (!user) notFound();

  const currentUserId = await tryGetCurrentUserId();
  const followRepo = new PrismaFollowRepository(prisma);
  const followStatus = await new GetFollowStatus(followRepo).execute({
    profileUserId: user.id,
    currentUserId,
  });

  const publicUser = user.toPublic();
  const initials = publicUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 p-4 backdrop-blur-sm">
        <h2 className="text-xl font-bold">{publicUser.displayName}</h2>
        <p className="text-sm text-muted-foreground">@{publicUser.username}</p>
      </div>
      <div className="h-32 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10" />
      <div className="-mt-12 px-4">
        <div className="flex items-end justify-between">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <FollowButton
            username={publicUser.username}
            initialIsFollowing={followStatus.isFollowing}
            isOwnProfile={isOwnProfile}
          />
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold">{publicUser.displayName}</h1>
          <p className="text-muted-foreground">@{publicUser.username}</p>
        </div>
        {publicUser.bio && <p className="mt-3 text-[15px]">{publicUser.bio}</p>}
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Joined{' '}
            {new Date(publicUser.createdAt).toLocaleDateString(undefined, {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="mt-3 flex gap-5 text-sm">
          <span className="hover:underline">
            <strong className="font-bold">{followStatus.followingCount}</strong>{' '}
            <span className="text-muted-foreground">Following</span>
          </span>
          <span className="hover:underline">
            <strong className="font-bold">{followStatus.followersCount}</strong>{' '}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
      </div>
    </div>
  );
}
