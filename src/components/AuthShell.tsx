import type { ReactNode } from "react";

import { AppFooter } from "./AppFooter.js";
import { AppLayout } from "./AppLayout.js";
import { KVSHVL_SITE_URL } from "../constants/legal-urls.js";

export interface AuthShellProps {
  /** Optional page heading below the KVSHVL header. */
  title?: string;
  children?: ReactNode;
}

const AUTH_SUBTITLE = "One sign-in for all KVSHVL apps.";

export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <AppLayout
      title="KVSHVL"
      subtitle={AUTH_SUBTITLE}
      titleAsWordmark
      titleHref={KVSHVL_SITE_URL}
      shellVariant="content"
      shellClassName="landing-shell auth-callback"
      footer={<AppFooter />}
    >
      <div className="auth-shell">
        {title !== undefined && <h2>{title}</h2>}
        {children}
      </div>
    </AppLayout>
  );
}
