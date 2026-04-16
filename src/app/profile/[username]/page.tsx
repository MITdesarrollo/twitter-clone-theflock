import { notFound } from 'next/navigation';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { PrismaFollowRepository } from '@/infra/prisma/repositories/PrismaFollowRepository';
import { prisma } from '@/infra/prisma/client';
import { GetFollowStatus } from '@/core/use-cases/follow/GetFollowStatus';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{publicUser.displayName}</h1>
                <p className="text-muted-foreground">@{publicUser.username}</p>
              </div>
              <FollowButton
                username={publicUser.username}
                initialIsFollowing={followStatus.isFollowing}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{publicUser.bio || 'No bio yet.'}</p>
          <div className="mt-3 flex gap-4 text-sm">
            <span>
              <strong>{followStatus.followingCount}</strong>{' '}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <strong>{followStatus.followersCount}</strong>{' '}
              <span className="text-muted-foreground">Followers</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Joined {new Date(publicUser.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
