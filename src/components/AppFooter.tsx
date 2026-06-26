import type { ReactNode } from "react";

import { LEGAL_URLS } from "../constants/legal-urls.js";

export interface FooterLink {
  href: string;
  label: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { href: LEGAL_URLS.privacy, label: "Privacy" },
  { href: LEGAL_URLS.terms, label: "Terms" },
  { href: LEGAL_URLS.refund, label: "Refund" },
  { href: LEGAL_URLS.contact, label: "Contact" },
];

export interface AppFooterProps {
  links?: FooterLink[];
}

export function AppFooter({ links = DEFAULT_LINKS }: AppFooterProps) {
  return (
    <footer className="app-footer">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </footer>
  );
}
