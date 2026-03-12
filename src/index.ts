// Provider and hooks
export { KotoProvider, useKoto, useTranslation } from './Provider';
export type { KotoProviderProps } from './Provider';

// Class component support
export { withTranslation, Translation, KotoConsumer } from './hoc';
export type { WithTranslationProps, TranslationProps } from './hoc';

// Translation functions
export { t, ti, tp, initTranslations, setTranslations, getLocale } from './t';

// Storage utilities
export { storage } from './storage';

// Types
export type {
  TranslationData,
  KotoConfig,
  KotoContextValue,
  StoredTranslations,
  LocaleInfo,
} from './types';

// Locale utilities
export {
  AVAILABLE_LOCALES,
  getLocaleInfo,
  isLocaleSupported,
  getFallbackLocale,
  resolveLocale
} from './locales';

// Utils
export { getNestedTranslation, flattenTranslations, unflattenTranslations } from './utils';

// Default export is the translation function
import { t } from './t';
export default t;