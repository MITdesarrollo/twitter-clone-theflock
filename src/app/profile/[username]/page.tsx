import { notFound } from 'next/navigation';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { prisma } from '@/infra/prisma/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const userRepo = new PrismaUserRepository(prisma);
  const user = await userRepo.findByUsername(username);

  if (!user) notFound();

  const publicUser = user.toPublic();
  const initials = publicUser.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{publicUser.displayName}</h1>
            <p className="text-muted-foreground">@{publicUser.username}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{publicUser.bio || 'No bio yet.'}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Joined {new Date(publicUser.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
