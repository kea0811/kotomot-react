import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { KotoConfig, KotoContextValue, TranslationData, LocaleInfo } from './types';
import { storage } from './storage';
import { getNestedTranslation } from './utils';
import { AVAILABLE_LOCALES } from './locales';

const KotoContext = createContext<KotoContextValue | null>(null);

export interface KotoProviderProps extends KotoConfig {
  children: React.ReactNode;
}

const LOCALE_STORAGE_KEY = 'koto-selected-locale';

// Accept either the API host (e.g. https://api.kotomot.app) or the full
// translations endpoint, and normalize to the translations endpoint.
function resolveEndpoint(apiUrl: string): string {
  const base = (apiUrl || '').replace(/\/+$/, '');
  return base.endsWith('/v1/translations') ? base : `${base}/v1/translations`;
}

export function KotoProvider({
  children,
  apiKey,
  projectId,
  defaultLocale,
  apiUrl = 'https://api.kotomot.app'
}: KotoProviderProps) {
  // Initialize locale from localStorage or use defaultLocale
  const getInitialLocale = () => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale) {
        return savedLocale;
      }
    }
    return defaultLocale;
  };

  const [translations, setTranslations] = useState<TranslationData>({});
  const [locale, setLocale] = useState(getInitialLocale());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const availableLocales = AVAILABLE_LOCALES;

  // Stabilize config in a ref to avoid re-triggering effects on prop changes
  const configRef = useRef({ apiKey, projectId, apiUrl });
  configRef.current = { apiKey, projectId, apiUrl };

  // Track if we've already loaded for a given locale to prevent duplicate calls
  const loadedLocalesRef = useRef<Set<string>>(new Set());

  // Fetch translations from API
  const fetchTranslations = useCallback(async (currentLocale: string) => {
    const { apiUrl, projectId, apiKey } = configRef.current;
    try {
      const response = await fetch(`${resolveEndpoint(apiUrl)}?locale=${currentLocale}&projectId=${projectId}`, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
      }

      const data = await response.json();

      // Let storage handle the response format dynamically
      return await storage.processApiResponse(currentLocale, data);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch translations');
    }
  }, []);

  // Check remote version against cached version
  const checkVersion = useCallback(async (): Promise<boolean> => {
    const { apiUrl, projectId, apiKey } = configRef.current;
    try {
      const response = await fetch(`${resolveEndpoint(apiUrl)}/version?projectId=${projectId}`, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) return false;
      const data = await response.json();
      const cachedVersion = await storage.getVersion(locale);
      // Returns true if versions differ (needs refetch)
      return !cachedVersion || !data.version || cachedVersion !== data.version;
    } catch {
      return false;
    }
  }, [locale]);

  // Load translations (from cache or API only if no cache exists)
  const loadTranslations = useCallback(async (currentLocale: string) => {
    // Prevent duplicate loads for the same locale
    if (loadedLocalesRef.current.has(currentLocale)) {
      return;
    }
    loadedLocalesRef.current.add(currentLocale);

    setLoading(true);
    setError(null);

    try {
      // Try to get from IndexedDB first
      const cached = await storage.getTranslations(currentLocale);

      if (cached) {
        // Cache exists — use it immediately
        setTranslations(cached.translations);
        setLoading(false);

        // Then check version in background — refetch if stale
        const needsUpdate = await checkVersion();
        if (needsUpdate) {
          const freshTranslations = await fetchTranslations(currentLocale);
          setTranslations(freshTranslations);
        }
      } else {
        // No cache, fetch from API
        const freshTranslations = await fetchTranslations(currentLocale);
        setTranslations(freshTranslations);
        setLoading(false);
      }
    } catch (err) {
      // Allow retry on failure
      loadedLocalesRef.current.delete(currentLocale);
      setError(err instanceof Error ? err : new Error('Failed to load translations'));
      setLoading(false);
    }
  }, [fetchTranslations, checkVersion]);

  // Refresh translations only if the remote version differs from cached version
  const refresh = useCallback(async () => {
    try {
      const needsUpdate = await checkVersion();
      if (!needsUpdate) return;

      // Version differs — fetch full translations
      const freshTranslations = await fetchTranslations(locale);
      setTranslations(freshTranslations);
      loadedLocalesRef.current.delete(locale);
    } catch (err) {
      console.error('Failed to refresh translations:', err);
    }
  }, [locale, checkVersion, fetchTranslations]);

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    const translation = getNestedTranslation(translations, key);
    return translation || fallback || key;
  }, [translations]);

  // Interpolation — replaces {name} and {{name}} (whitespace-tolerant).
  const ti = useCallback((key: string, params: Record<string, string | number>, fallback?: string): string => {
    let out = t(key, fallback);
    for (const [k, v] of Object.entries(params || {})) {
      const val = v === undefined || v === null ? '' : String(v);
      const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out
        .replace(new RegExp(`{{\\s*${esc}\\s*}}`, 'g'), val)
        .replace(new RegExp(`{\\s*${esc}\\s*}`, 'g'), val);
    }
    return out;
  }, [t]);

  // Pluralization — picks key.zero / key.one / key.other and injects count.
  const tp = useCallback((key: string, count: number, params?: Record<string, string | number>): string => {
    const pluralKey = count === 0 ? `${key}.zero` : count === 1 ? `${key}.one` : `${key}.other`;
    const hasPlural = getNestedTranslation(translations, pluralKey);
    return ti(hasPlural ? pluralKey : key, { count, ...(params || {}) });
  }, [translations, ti]);

  // Function to change locale
  const changeLocale = useCallback((newLocale: string) => {
    if (newLocale !== locale) {
      // Clear loaded flag so translations are re-fetched/re-applied for this locale
      loadedLocalesRef.current.delete(newLocale);
      setLocale(newLocale);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      }
    }
  }, [locale]);

  // Get available locales (returns hardcoded list)
  const getAvailableLocales = useCallback((): LocaleInfo[] => {
    return availableLocales;
  }, [availableLocales]);

  // Load translations on mount and locale change — only depends on locale
  useEffect(() => {
    loadTranslations(locale);
  }, [locale, loadTranslations]);

  // Context value
  const value = useMemo<KotoContextValue>(() => ({
    translations,
    locale,
    loading,
    error,
    t,
    ti,
    tp,
    setLocale: changeLocale,
    refresh,
    availableLocales,
    getAvailableLocales,
  }), [translations, locale, loading, error, t, ti, tp, changeLocale, refresh, availableLocales, getAvailableLocales]);

  // Don't block rendering forever — use a timeout to prevent blank screens
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Don't render children until translations are loaded, but allow after timeout
  if (loading && !timedOut) {
    return null;
  }

  return (
    <KotoContext.Provider value={value}>
      {children}
    </KotoContext.Provider>
  );
}

// Hook to use Koto context
export function useKoto(): KotoContextValue {
  const context = useContext(KotoContext);
  if (!context) {
    throw new Error('useKoto must be used within a KotoProvider');
  }
  return context;
}

// Hook to use translation function
export function useTranslation() {
  const { t, ti, tp, locale, loading, setLocale, refresh, availableLocales, getAvailableLocales } = useKoto();
  return { t, ti, tp, locale, loading, setLocale, refresh, availableLocales, getAvailableLocales };
}
