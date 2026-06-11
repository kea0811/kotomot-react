---
name: kotomot-react
description: Use when the user wants i18n in a browser React app (Next.js, Vite, CRA) backed by the Kotomot translation platform. Provides `<KotoProvider>` + `useTranslation()` with IndexedDB caching + version-based revalidation + runtime locale switching. Sibling SDKs exist for Node (`kotomot-node-sdk`), React Native (`kotomot-react-native`), and Flutter (`kotomot_flutter`).
---

# kotomot-react

A React translation library for browser apps, backed by the [Kotomot](https://kotomot.app) hosted platform. IndexedDB cache + version-based revalidation so the second visit is instant and offline-tolerant.

## When to reach for this

User says:
- "add i18n to my React / Next.js / Vite app"
- "translation management with a real dashboard, not a JSON file"
- "live locale switching at runtime"

For a different host environment, point them at the matching SDK:
- Server-side Node (SSR, build scripts, CLIs) → `kotomot-node-sdk`
- React Native → `kotomot-react-native`
- Flutter → `kotomot_flutter`

## Install

```bash
pnpm add kotomot-react
```

## Quick start

```tsx
import { KotoProvider, useTranslation } from 'kotomot-react';

// 1. Wrap once
export function App() {
  return (
    <KotoProvider
      apiKey={import.meta.env.VITE_KOTOMOT_API_KEY}  // generate in dashboard
      projectId="your-project"
      defaultLocale="en"
    >
      <Routes />
    </KotoProvider>
  );
}

// 2. Translate anywhere
function Hero() {
  const { t, locale, setLocale, loading } = useTranslation();
  if (loading) return null;
  return (
    <>
      <h1>{t('home.hero.title')}</h1>
      <button onClick={() => setLocale('ja')}>日本語</button>
    </>
  );
}
```

## `<KotoProvider>` props

| Prop | Required | Notes |
|---|---|---|
| `apiKey` | ✓ | Generate in the dashboard. Read-scoped is fine for client apps. |
| `projectId` | ✓ | Your project slug or ID. |
| `defaultLocale` | ✓ | Locale to read on first paint. |
| `apiUrl` | — | Defaults to `https://api.kotomot.app`. Self-hosters pass their own. |
| `namespace` | — | Limit to one namespace (e.g. `'auth'`). |
| `environment` | — | Pin to a published environment (e.g. `'production'`). |

## `useTranslation()` returns

| Field | Type | Notes |
|---|---|---|
| `t(key, fallback?)` | `(string, string?) => string` | Resolves a flat key path like `'home.hero.title'`. |
| `ti(key, vars)` | `(string, Record<string, string>) => string` | Interpolates `{name}`-style placeholders. |
| `locale` | `string` | Current active locale. |
| `setLocale(code)` | `(string) => Promise<void>` | Loads + activates a new locale at runtime. |
| `loading` | `boolean` | True during initial fetch + locale switches. |
| `availableLocales` | `string[]` | Locales the project supports. |

## Gotchas worth knowing

1. **Reads come from the PUBLISHED set.** Edits in the dashboard go live only after you publish a version. Use `environment` to pin to a specific environment (`'production'`, `'staging'`) so your app reads what you intend.
2. **First paint can show keys instead of values** if you render translations before `loading === false`. Guard with `if (loading) return <Skeleton />;`.
3. **IndexedDB is required.** Server-rendered React (SSR) is fine — the provider handles the no-IDB case during render — but the hydration step still needs IDB to cache.
4. **`apiKey` ships in the client bundle.** Use a read-scoped key (not `write:translations`). Rotate it from the dashboard if it leaks.
5. **The cache revalidates by version** — not by TTL. A dashboard publish bumps the version, the SDK detects on next focus / revalidate, and silently swaps to fresh content.

## Links

- npm: https://www.npmjs.com/package/kotomot-react
- platform: https://kotomot.app
- repo: https://github.com/kea0811/kotomot-react
- sibling SDKs:
  - `kotomot-node-sdk` (server-side Node)
  - `kotomot-react-native`
  - `kotomot_flutter`
