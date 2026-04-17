import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Twitter Clone</h1>
          <p className="text-sm text-muted-foreground">The Flock Challenge</p>
        </div>
        {children}
      </div>
    </div>
  );
}
