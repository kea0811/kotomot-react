# Koto React

> **Koto** (言) — Japanese for "word." Every translation starts with a single word. Koto bridges languages one word at a time.

A React translation library with IndexedDB caching for optimal performance.

## Installation

```bash
npm install koto-react
# or
yarn add koto-react
```

## Usage

### Basic Setup with Provider

```tsx
import React from 'react';
import { KotoProvider } from 'koto-react';

function App() {
  return (
    <KotoProvider
      apiKey="your-api-key"
      defaultLocale="en"
      apiUrl="https://your-api-endpoint.com/translations" // optional
    >
      <YourApp />
    </KotoProvider>
  );
}
```

### Using the Translation Hook

```tsx
import React from 'react';
import { useTranslation } from 'koto-react';

function MyComponent() {
  const { t, locale, loading } = useTranslation();

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div>
      <h1>{t('checkout.payment.title')}</h1>
      <p>{t('checkout.payment.description', 'Default fallback text')}</p>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Using the Standalone Translation Function

For non-React contexts or utility functions:

```typescript
import { t, initTranslations } from 'koto-react';

// Initialize once in your app
await initTranslations('en');

// Use anywhere
const title = t('checkout.payment.title');
const notFound = t('some.missing.key'); // Returns 'some.missing.key'
const withFallback = t('some.missing.key', 'Fallback text'); // Returns 'Fallback text'
```

### Translation with Interpolation

```typescript
import { ti } from 'koto-react';

// If translation is: "Hello, {{name}}! You have {{count}} items."
const message = ti('greeting.message', {
  name: 'John',
  count: 5
});
// Returns: "Hello, John! You have 5 items."
```

### Pluralization

```typescript
import { tp } from 'koto-react';

// Translations:
// "items.zero": "No items"
// "items.one": "One item"
// "items.other": "{{count}} items"

tp('items', 0);  // "No items"
tp('items', 1);  // "One item"
tp('items', 5);  // "5 items"
```

## Features

- **Automatic Caching**: Translations are cached in IndexedDB for offline access and faster loads
- **Background Updates**: Cached translations are served immediately while fresh data is fetched in the background
- **Nested Keys**: Support for nested translation keys using dot notation
- **TypeScript Support**: Full TypeScript support with type definitions
- **Offline Support**: Works offline using cached translations
- **Flexible API**: Use with React hooks or standalone functions

## API Reference

### KotoProvider

The main provider component that manages translations.

**Props:**
- `apiKey` (string, required): Your API key for fetching translations
- `defaultLocale` (string, required): The default locale to use
- `apiUrl` (string, optional): Custom API endpoint URL
- `children` (ReactNode, required): Your app components

### useTranslation()

Hook that returns translation utilities.

**Returns:**
- `t(key: string, fallback?: string): string` - Translation function
- `locale: string` - Current locale
- `loading: boolean` - Loading state

### t(key: string, fallback?: string): string

Standalone translation function.

**Parameters:**
- `key`: The translation key (supports dot notation)
- `fallback`: Optional fallback value if translation not found

**Returns:** The translated string or the key if not found

### Storage

Translations are automatically cached in IndexedDB with:
- 1-hour cache duration (configurable)
- Automatic cleanup of expired entries
- Per-locale storage

## License

MIT