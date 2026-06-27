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
  /** Pin header and footer; scroll only the main content region. */
  fixedChrome?: boolean;
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
  fixedChrome = false,
  footer,
  children,
}: AppLayoutProps) {
  const shellClass = shellClassName ?? SHELL_CLASS[shellVariant];
  const pageBodyClass = fixedChrome ? "page-body page-body--fixed-chrome" : "page-body";
  const shellLayoutClass = fixedChrome ? `${shellClass} app-shell--fixed-chrome` : shellClass;

  return (
    <div className={pageBodyClass}>
      <main className={shellLayoutClass}>
        <AppHeader
          title={title}
          subtitle={subtitle}
          titleHref={titleHref}
          titleAsWordmark={titleAsWordmark}
          navLinks={navLinks}
          authSlot={authSlot}
        />
        {fixedChrome ? (
          <>
            <div className="app-scroll-region">{children}</div>
            {footer !== undefined && <div className="app-chrome-footer">{footer}</div>}
          </>
        ) : (
          <>
            {children}
            {footer}
          </>
        )}
      </main>
    </div>
  );
}

export type { NavLink };
