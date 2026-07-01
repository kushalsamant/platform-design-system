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

export const GLOBAL_NAV_LINKS: NavLink[] = [
  { href: "https://kvshvl.in/#research", label: "Research" },
];

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  titleHref?: string;
  titleAsWordmark?: boolean;
  navLinks?: NavLink[];
  authSlot?: ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  titleHref = "/",
  titleAsWordmark = false,
  navLinks = [],
  authSlot,
}: AppHeaderProps) {
  const titleContent =
    title !== undefined && titleHref.length > 0 ? (
      <a href={titleHref} className="app-header-title-link">
        {title}
      </a>
    ) : (
      title
    );

  return (
    <header className="app-header">
      <div className="app-header-row">
        <div>
          {title !== undefined &&
            (titleAsWordmark ? (
              <p className="app-wordmark">{titleContent}</p>
            ) : (
              <h1>{titleContent}</h1>
            ))}
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
