import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { getAuthToken } from '@/lib/auth/cookie';
import { GetCurrentUser } from '@/core/use-cases/auth/GetCurrentUser';
import { PrismaUserRepository } from '@/infra/prisma/repositories/PrismaUserRepository';
import { JoseAuthService } from '@/infra/auth/JoseAuthService';
import { prisma } from '@/infra/prisma/client';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Twitter Clone',
  description: 'Full-stack Twitter clone — Technical challenge for The Flock',
};

async function getCurrentUser() {
  try {
    const token = await getAuthToken();
    if (!token) return null;
    const userRepo = new PrismaUserRepository(prisma);
    const authService = new JoseAuthService();
    const useCase = new GetCurrentUser(userRepo, authService);
    return await useCase.execute(token);
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider initialUser={currentUser}>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
            </div>
            <MobileNav />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
