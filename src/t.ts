import { storage } from './storage';
import { getNestedTranslation } from './utils';
import { TranslationData } from './types';

// Global cache for translations
let globalTranslations: TranslationData = {};
let globalLocale: string = 'en';
let isInitialized = false;

/**
 * Initialize the translation function with a locale
 * This should be called once when the app starts
 */
export async function initTranslations(locale: string): Promise<void> {
  globalLocale = locale;
  
  // Try to load from IndexedDB
  const cached = await storage.getTranslations(locale);
  if (cached) {
    globalTranslations = cached.translations;
    isInitialized = true;
  }
}

/**
 * Set translations directly (useful when fetched from API)
 */
export function setTranslations(translations: TranslationData, locale: string): void {
  globalTranslations = translations;
  globalLocale = locale;
  isInitialized = true;
  
  // Store in IndexedDB for future use
  storage.setTranslations(locale, translations);
}

/**
 * Get current locale
 */
export function getLocale(): string {
  return globalLocale;
}

/**
 * Translation function
 * @param key - The translation key (e.g., 'checkout.payment.title')
 * @param fallback - Optional fallback value if translation not found
 * @returns The translated string or the key if not found
 */
export function t(key: string, fallback?: string): string {
  if (!isInitialized) {
    console.warn('Translations not initialized. Call initTranslations() first.');
    return fallback || key;
  }

  const translation = getNestedTranslation(globalTranslations, key);
  return translation || fallback || key;
}

/**
 * Translation function with interpolation
 * @param key - The translation key
 * @param params - Object with values to interpolate
 * @param fallback - Optional fallback value
 * @returns The translated and interpolated string
 * 
 * @example
 * // Translation: "Hello, {{name}}!"
 * ti('greeting', { name: 'John' }) // "Hello, John!"
 */
export function ti(key: string, params: Record<string, string | number>, fallback?: string): string {
  let translation = t(key, fallback);
  
  // Replace placeholders with values
  Object.entries(params).forEach(([paramKey, value]) => {
    const placeholder = new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g');
    translation = translation.replace(placeholder, String(value));
  });
  
  return translation;
}

/**
 * Pluralization helper
 * @param key - The base translation key
 * @param count - The count for pluralization
 * @param params - Optional parameters for interpolation
 * @returns The pluralized translation
 * 
 * @example
 * // Translations:
 * // "items.zero": "No items"
 * // "items.one": "One item"
 * // "items.other": "{{count}} items"
 * tp('items', 0) // "No items"
 * tp('items', 1) // "One item"
 * tp('items', 5) // "5 items"
 */
export function tp(key: string, count: number, params?: Record<string, string | number>): string {
  let pluralKey = key;
  
  if (count === 0) {
    pluralKey = `${key}.zero`;
  } else if (count === 1) {
    pluralKey = `${key}.one`;
  } else {
    pluralKey = `${key}.other`;
  }
  
  // Try the plural key first, fall back to base key
  let translation = t(pluralKey);
  if (translation === pluralKey) {
    translation = t(key);
  }
  
  // Apply interpolation with count included
  const allParams = { count, ...params };
  return ti(translation, allParams);
}

// Export default translation function
export default t;