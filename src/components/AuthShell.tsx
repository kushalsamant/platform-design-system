import type { ReactNode } from "react";

export interface AuthShellProps {
  title: string;
  children?: ReactNode;
}

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <h1>{title}</h1>
      {children}
    </main>
  );
}
