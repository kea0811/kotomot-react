import { TranslationData } from './types';

/**
 * Get a nested translation value using dot notation
 * @param translations - The translations object
 * @param key - The dot-notated key (e.g., 'checkout.payment.title')
 * @returns The translation value or null if not found
 */
export function getNestedTranslation(
  translations: TranslationData,
  key: string
): string | null {
  const keys = key.split('.');
  let current: string | TranslationData = translations;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k] as TranslationData;
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

/**
 * Flatten nested translation object
 * @param obj - The nested translation object
 * @param prefix - The prefix for keys
 * @returns Flattened object with dot-notated keys
 */
export function flattenTranslations(
  obj: TranslationData,
  prefix = ''
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      flattened[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    }
  }

  return flattened;
}

/**
 * Unflatten dot-notated keys to nested object
 * @param obj - The flattened object
 * @returns Nested translation object
 */
export function unflattenTranslations(obj: Record<string, string>): TranslationData {
  const result: TranslationData = {};

  for (const [key, value] of Object.entries(obj)) {
    const keys = key.split('.');
    let current: TranslationData = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k] as TranslationData;
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}