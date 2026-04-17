import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
            <span className="text-2xl font-bold text-primary-foreground">F</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to Flock</h1>
            <p className="text-sm text-muted-foreground">The Twitter Clone Challenge</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
