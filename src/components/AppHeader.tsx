import type { ReactNode } from "react";

export type NavLink = {
  href: string;
  label: string;
};

export type ShellVariant = "wide" | "content";

const SHELL_CLASS: Record<ShellVariant, string> = {
  wide: "app-shell",
  content: "landing-shell",
};

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  navLinks?: NavLink[];
  authSlot?: ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  navLinks = [],
  authSlot,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-row">
        <div>
          {title !== undefined && <h1>{title}</h1>}
          {subtitle !== undefined && <p>{subtitle}</p>}
        </div>

        {(navLinks.length > 0 || authSlot !== undefined) && (
          <div className="auth-actions">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="header-link">
                {link.label}
              </a>
            ))}
            {authSlot}
          </div>
        )}
      </div>
    </header>
  );
}
