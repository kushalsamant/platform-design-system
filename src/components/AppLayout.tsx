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
  titleHref?: string;
  titleAsWordmark?: boolean;
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
  titleHref,
  titleAsWordmark,
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
          titleHref={titleHref}
          titleAsWordmark={titleAsWordmark}
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
