import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { KotoConfig, KotoContextValue, TranslationData, LocaleInfo } from './types';
import { storage } from './storage';
import { getNestedTranslation } from './utils';
import { AVAILABLE_LOCALES } from './locales';

const KotoContext = createContext<KotoContextValue | null>(null);

export interface KotoProviderProps extends KotoConfig {
  children: React.ReactNode;
}

const LOCALE_STORAGE_KEY = 'koto-selected-locale';

export function KotoProvider({
  children, 
  apiKey,
  projectId, 
  defaultLocale,
  apiUrl = 'https://api.koto.dev/v1/translations'
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
  // Use hardcoded locales that match the database
  const availableLocales = AVAILABLE_LOCALES;

  // Fetch translations from API
  const fetchTranslations = useCallback(async (currentLocale: string) => {
    try {
      const response = await fetch(`${apiUrl}?locale=${currentLocale}&projectId=${projectId}`, {
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
  }, [apiKey, projectId, apiUrl]);

  // Load translations (from cache or API)
  const loadTranslations = useCallback(async (currentLocale: string) => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from IndexedDB first
      const cached = await storage.getTranslations(currentLocale);
      
      if (cached) {
        setTranslations(cached.translations);
        setLoading(false);
        
        // Fetch fresh data in background
        fetchTranslations(currentLocale)
          .then((freshTranslations: TranslationData) => {
            setTranslations(freshTranslations);
          })
          .catch(console.error);
      } else {
        // No cache, fetch from API
        const freshTranslations = await fetchTranslations(currentLocale);
        setTranslations(freshTranslations);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load translations'));
      setLoading(false);
    }
  }, [fetchTranslations]);

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    const translation = getNestedTranslation(translations, key);
    return translation || fallback || key;
  }, [translations]);

  // Function to change locale
  const changeLocale = useCallback((newLocale: string) => {
    if (newLocale !== locale) {
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

  // Load translations on mount and locale change
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
    setLocale: changeLocale,
    availableLocales,
    getAvailableLocales,
  }), [translations, locale, loading, error, t, changeLocale, availableLocales, getAvailableLocales]);

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
  const { t, locale, loading, setLocale, availableLocales, getAvailableLocales } = useKoto();
  return { t, locale, loading, setLocale, availableLocales, getAvailableLocales };
}