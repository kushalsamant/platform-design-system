import type { ReactNode } from "react";

import { AppHeader, type NavLink } from "./AppHeader.js";

export type ShellVariant = "wide" | "content";

const SHELL_CLASS: Record<ShellVariant, string> = {
  wide: "app-shell",
  content: "landing-shell",
};

export interface AppLayoutProps {
  title?: string;
  subtitle?: string;
  navLinks?: NavLink[];
  authSlot?: ReactNode;
  shellVariant?: ShellVariant;
  shellClassName?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AppLayout({
  title,
  subtitle,
  navLinks,
  authSlot,
  shellVariant = "wide",
  shellClassName,
  footer,
  children,
}: AppLayoutProps) {
  const shellClass = shellClassName ?? SHELL_CLASS[shellVariant];

  return (
    <div className="page-body">
      <main className={shellClass}>
        <AppHeader
          title={title}
          subtitle={subtitle}
          navLinks={navLinks}
          authSlot={authSlot}
        />
        {children}
        {footer}
      </main>
    </div>
  );
}

export type { NavLink };
