export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface KotoConfig {
  apiKey: string;
  projectId: string;
  defaultLocale: string;
  apiUrl?: string;
}

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName?: string;
  direction?: 'ltr' | 'rtl';
  enabled?: boolean;
}

export interface KotoContextValue {
  translations: TranslationData;
  locale: string;
  loading: boolean;
  error: Error | null;
  t: (key: string, fallback?: string) => string;
  setLocale: (locale: string) => void;
  availableLocales: LocaleInfo[];
  getAvailableLocales: () => LocaleInfo[];
}

export interface StoredTranslations {
  locale: string;
  translations: TranslationData;
  timestamp: number;
  version?: string;
  metadata?: LocaleMetadata;
}

export interface LocaleMetadata {
  name?: string;
  nativeName?: string;
  direction?: 'ltr' | 'rtl';
}

export interface ApiResponse {
  translations?: TranslationData;
  data?: TranslationData | Record<string, string>;
  locale?: string;
  version?: string;
  localeInfo?: LocaleMetadata;
  localeName?: string;
  localeNativeName?: string;
  direction?: 'ltr' | 'rtl';
  availableLocales?: LocaleInfo[];
  error?: string;
}