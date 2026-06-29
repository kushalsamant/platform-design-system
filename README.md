# @kvshvl/platform-design-system

Shared KVSHVL platform chrome: design tokens, base CSS, standard page styles, and React layout components.

**New app?** See [docs/app-template.md](docs/app-template.md) for integration checklist and guardrails.

## Install (local dev)

```json
{
  "dependencies": {
    "@kvshvl/platform-design-system": "file:../platform-design-system"
  }
}
```

Run `npm install` in the consuming app after adding the dependency. Re-run `npm run build` in this package when CSS or components change.

## CSS

| Import | Contents |
|--------|----------|
| `@kvshvl/platform-design-system/tokens.css` | `:root` variables only |
| `@kvshvl/platform-design-system/base.css` | Reset, buttons, links, app shell, header, footer, auth shell |
| `@kvshvl/platform-design-system/pages.css` | Landing, pricing, account, alerts (imports base) |

### Vite (Check Your Drawings)

```ts
// main.tsx
import "@kvshvl/platform-design-system/tokens.css";
import "@kvshvl/platform-design-system/base.css";
import "@kvshvl/platform-design-system/pages.css";
import "./compare.css"; // app-unique feature UI only
```

### Next.js (auth)

```tsx
// app/layout.tsx
import "@kvshvl/platform-design-system/tokens.css";
import "@kvshvl/platform-design-system/base.css";
```

auth does not need `pages.css` or `AppLayout`.

## React components

```tsx
import {
  AppLayout,
  AppHeader,
  AppFooter,
  AuthShell,
  type NavLink,
} from "@kvshvl/platform-design-system";
```

### App layout (product apps)

```tsx
const navLinks: NavLink[] = [
  { href: "/", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
];

<AppLayout
  title="Check Your Drawings"
  subtitle="Upload Drawing A and Drawing B."
  navLinks={navLinks}
  authSlot={<YourAuthButtons />}
  shellVariant="wide"
>
  {children}
</AppLayout>
```

- `shellVariant="wide"` — 1180px app shell (default)
- `shellVariant="content"` — narrower landing/about width
- `authSlot` — app-owned sign-in/out UI
- `footer` — optional; pass `<AppFooter />` if needed

### Auth shell

Uses the same KVSHVL header (wordmark links to kvshvl.in) and legal footer as product apps:

```tsx
<AuthShell>
  <button type="button" className="action-primary">Continue with Google</button>
</AuthShell>
```

Pass `title` for error or status headings below the header.

## App config pattern

Keep nav links in one file per app:

```ts
// src/lib/site-chrome.ts
import type { NavLink } from "@kvshvl/platform-design-system";

export const navLinks: NavLink[] = [
  { href: "/", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/account", label: "Account" },
  { href: "/about", label: "About" },
];
```

## CSS consistency

Run after changing tokens or app CSS wiring:

```bash
npm run check:css
```

This verifies:

- `kvshvl/assets/css/main.css` `:root` matches `src/tokens.css`
- `html` font-size matches between `base.css` and the brand site
- `platform-auth` imports platform CSS via `globals.css`
- `checkyourdrawings` imports `tokens.css`, `base.css`, and `pages.css`

**Rule:** Edit tokens in `src/tokens.css` only. Sync the brand site `:root` block when tokens change.

## Build

```bash
npm run build
```

Copies CSS to `dist/` and compiles TypeScript components.

## CSS ownership

| CSS | Owner |
|-----|-------|
| tokens, base, pages | This package |
| Compare UI, 3D viewer, etc. | Each app's repo |

Promote app CSS here only when a second app needs the same styles.
