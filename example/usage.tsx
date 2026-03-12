import React from 'react';
import { KotoProvider, useTranslation, t } from 'koto-react';

// Example 1: Using with Provider in React
function App() {
  return (
    <KotoProvider
      apiKey="your-api-key-here"
      defaultLocale="en"
      apiUrl="https://api.your-koto-instance.com/translations"
    >
      <ExampleComponent />
    </KotoProvider>
  );
}

// Example 2: Using the hook in a component
function ExampleComponent() {
  const { t, locale, loading } = useTranslation();

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div>
      {/* Basic translation */}
      <h1>{t('checkout.payment.title')}</h1>

      {/* Translation with fallback */}
      <p>{t('checkout.payment.description', 'Enter your payment information')}</p>

      {/* Key that doesn't exist - returns the key */}
      <p>{t('checkout.payment.title.not.found')}</p>

      <p>Current locale: {locale}</p>
    </div>
  );
}

// Example 3: Using standalone t function (outside React components)
async function exampleStandaloneUsage() {
  // Initialize translations first
  await initTranslations('en');

  // Now use t function anywhere
  const title = t('checkout.payment.title');
  console.log(title); // Outputs the translation

  const notFound = t('checkout.payment.title.not.found');
  console.log(notFound); // Outputs: 'checkout.payment.title.not.found'

  const withFallback = t('some.missing.key', 'Default text');
  console.log(withFallback); // Outputs: 'Default text'
}

// Example 4: How translations are stored in IndexedDB
/*
The translations are automatically cached in IndexedDB with the following structure:
- Database name: 'koto-translations'
- Object store: 'translations'
- Key: locale (e.g., 'en', 'es', 'fr')
- Value: {
    locale: string,
    translations: {
      checkout: {
        payment: {
          title: "Payment Information",
          description: "Please enter your payment details"
        }
      },
      // ... more translations
    },
    timestamp: number,
    version?: string
  }

The cache expires after 1 hour, but serves stale data while fetching fresh translations.
*/

export default App;