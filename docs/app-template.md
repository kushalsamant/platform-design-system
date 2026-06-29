# KVSHVL app — design system integration

Use `@kvshvl/platform-design-system` for every KVSHVL React frontend. Apps differ in **nav links** and **feature UI** only.

**Reference implementation:** [checkyourdrawings/frontend](https://github.com/kushalsamant/checkyourdrawings/tree/main/frontend)

For stack, deploy, and platform-api wiring, see [kvshvl-app-template.md](../../.cursor/docs/kvshvl-app-template.md) in the workspace docs.

---

## 1. Add the dependency

Local dev (sibling repo):

```json
{
  "dependencies": {
    "@kvshvl/platform-design-system": "file:../platform-design-system"
  }
}
```

Adjust the relative path if your app repo layout differs (`file:../../platform-design-system` for nested frontends).

Run `npm install` in the app. After any CSS or component change in the package, run `npm run build` there and reinstall or rebuild the app if imports look stale.

When published, replace `file:` with a version pin (e.g. `"@kvshvl/platform-design-system": "^0.1.0"`).

---

## 2. Wire CSS

| App type | Imports | App-local CSS |
|----------|---------|---------------|
| Product (Vite) | `tokens.css` + `base.css` + `pages.css` | One feature file (e.g. `compare.css`) |
| Auth-only (Next) | `tokens.css` + `base.css` via `globals.css` | None |

### Vite entry (product app)

```ts
// main.tsx
import "@kvshvl/platform-design-system/tokens.css";
import "@kvshvl/platform-design-system/base.css";
import "@kvshvl/platform-design-system/pages.css";
import "./<feature>.css"; // app-unique UI only
```

### Next.js (auth-style)

```css
/* app/globals.css */
@import "@kvshvl/platform-design-system/tokens.css";
@import "@kvshvl/platform-design-system/base.css";
```

```tsx
// app/layout.tsx
import "./globals.css";
```

Auth apps do **not** need `pages.css`, `AppLayout`, or `AppHeader`.

---

## 3. Guardrails

1. **Always** depend on this package for tokens, base chrome, and standard pages (pricing, account, about).
2. **Never** copy `:root` variables or `.app-header` rules into app repos.
3. **App-local CSS is the exception** — keep one small file per app for unique feature UI (compare viewer, 3D canvas, etc.).
4. **Promote to the package** only when a **second** app needs the same styles.
5. **Legal pages** live on [kvshvl.in](https://kvshvl.in). `AppFooter` is optional; link from About or footer when you want persistent legal links.
6. **Pricing and account** live on each **product app** (`/pricing`, `/account`). The brand site has no `/pricing`. KVSHVL Pro is one subscription per account — app pages must say so and name current Pro apps explicitly.

---

## 4. Nav links — `site-chrome.ts`

One file per app exports header navigation:

```ts
// src/lib/site-chrome.ts
import type { NavLink } from "@kvshvl/platform-design-system";

export const navLinks: NavLink[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/account", label: "Account" },
  { href: "/about", label: "About" },
];
```

Check Your Drawings: [`checkyourdrawings/frontend/src/lib/site-chrome.ts`](../../checkyourdrawings/frontend/src/lib/site-chrome.ts).

---

## 5. Layout wrapper — `PlatformAppLayout`

Product apps wrap package `AppLayout` so pages only pass `title` / `subtitle`:

```tsx
// src/components/PlatformAppLayout.tsx
import { AppLayout, type AppLayoutProps } from "@kvshvl/platform-design-system";
import { navLinks } from "../lib/site-chrome";
import { AuthActions } from "./AuthActions";

export type PlatformAppLayoutProps = Omit<AppLayoutProps, "navLinks" | "authSlot">;

export function PlatformAppLayout({ title, subtitle, ...props }: PlatformAppLayoutProps) {
  return (
    <AppLayout
      title={title}
      subtitle={subtitle}
      navLinks={navLinks}
      authSlot={<AuthActions />}
      {...props}
    />
  );
}
```

- `authSlot` — app-owned sign-in/out (platform JWT, NextAuth, etc.).
- Header `title` links to `/` by default (`titleHref`); do not add a separate Home nav link.
- `shellVariant="wide"` — default product width (1180px).
- `shellVariant="content"` — narrower about/landing width.
- `footer` — optional `<AppFooter />`; not required if About links to kvshvl.in legal URLs.

Auth-only apps use `AuthShell`, which wraps the same KVSHVL header and legal footer as product apps:

```tsx
import { AuthShell } from "@kvshvl/platform-design-system";

<AuthShell title="Sign-in error">
  <p className="text-muted">Your message here.</p>
</AuthShell>
```

Omit `title` on the main sign-in screen — the header already shows the KVSHVL wordmark and tagline.

---

## 6. Next.js — linked package gotcha

When using `file:../platform-design-system`, Next.js must resolve the package from the parent directory:

```ts
// next.config.ts
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const nextConfig = {
  transpilePackages: ["@kvshvl/platform-design-system"],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
```

Reference: [`platform-auth/next.config.ts`](../../platform-auth/next.config.ts).

---

## 7. Verify after changes

From `platform-design-system`:

```bash
npm run build
npm run check:css
```

`check:css` confirms token alignment with the brand site, and that `platform-auth` and `checkyourdrawings` import the package correctly.

In the consuming app:

```bash
npm run build
```

---

## CSS ownership summary

| CSS | Owner |
|-----|-------|
| `tokens.css`, `base.css`, `pages.css` | `platform-design-system` |
| Feature UI (compare, viewer, etc.) | Each app's repo |

Edit tokens in `platform-design-system/src/tokens.css` only. When tokens change, sync the brand site `:root` block in `kvshvl` (or run a future copy script) so `check:css` keeps passing.
