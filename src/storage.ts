import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TranslationData, StoredTranslations, ApiResponse, LocaleMetadata } from './types';

interface KotoDB extends DBSchema {
  translations: {
    key: string;
    value: StoredTranslations;
  };
}

const DB_NAME = 'koto-translations';
const DB_VERSION = 3;
const STORE_NAME = 'translations';
class TranslationStorage {
  private db: IDBPDatabase<KotoDB> | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<KotoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create or keep translations store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }

  async getTranslations(locale: string): Promise<StoredTranslations | null> {
    await this.init();
    if (!this.db) return null;

    try {
      const stored = await this.db.get(STORE_NAME, locale);
      if (!stored) return null;
      return stored;
    } catch (error) {
      console.error('Error getting translations from IndexedDB:', error);
      return null;
    }
  }

  async getVersion(locale: string): Promise<string | undefined> {
    const stored = await this.getTranslations(locale);
    return stored?.version;
  }

  async setTranslations(locale: string, translations: TranslationData, apiResponse?: ApiResponse): Promise<void> {
    await this.init();
    if (!this.db) return;

    try {
      // Process translations based on API response format
      const processedTranslations = this.processTranslations(translations);
      
      const stored: StoredTranslations = {
        locale,
        translations: processedTranslations,
        timestamp: Date.now(),
        version: apiResponse?.version,
      };
      
      // Include metadata if provided in API response
      if (apiResponse?.localeInfo || apiResponse?.localeName) {
        stored.metadata = {
          name: apiResponse.localeName || apiResponse.localeInfo?.name,
          nativeName: apiResponse.localeNativeName || apiResponse.localeInfo?.nativeName,
          direction: apiResponse.direction || apiResponse.localeInfo?.direction || 'ltr',
        };
      }
      
      await this.db.put(STORE_NAME, stored, locale);
    } catch (error) {
      console.error('Error storing translations in IndexedDB:', error);
    }
  }

  private processTranslations(translations: TranslationData | Record<string, string>): TranslationData {
    // Handle different response formats
    if (typeof translations === 'object' && translations !== null) {
      // Check if it's already in the right format
      if (this.isNestedStructure(translations)) {
        return translations;
      }
      
      // Check if it's a flat key-value structure
      if (this.isFlatStructure(translations)) {
        return this.buildNestedFromFlat(translations as Record<string, string>);
      }
    }
    
    // Return as-is if we can't determine the structure
    return translations;
  }

  private isNestedStructure(obj: TranslationData | Record<string, string>): boolean {
    // Check if any value is an object (nested structure)
    return Object.values(obj).some(val => 
      typeof val === 'object' && val !== null && !Array.isArray(val)
    );
  }

  private isFlatStructure(obj: TranslationData | Record<string, string>): boolean {
    // Check if all values are strings and keys contain dots
    return Object.entries(obj).every(([, val]) => 
      typeof val === 'string'
    ) && Object.keys(obj).some(key => key.includes('.'));
  }

  private buildNestedFromFlat(flatData: Record<string, string>): TranslationData {
    const result: TranslationData = {};
    
    for (const [key, value] of Object.entries(flatData)) {
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


  async clearTranslations(locale?: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    try {
      if (locale) {
        await this.db.delete(STORE_NAME, locale);
      } else {
        await this.db.clear(STORE_NAME);
      }
    } catch (error) {
      console.error('Error clearing translations from IndexedDB:', error);
    }
  }

  async getAllLocales(): Promise<string[]> {
    await this.init();
    if (!this.db) return [];

    try {
      return await this.db.getAllKeys(STORE_NAME);
    } catch (error) {
      console.error('Error getting locales from IndexedDB:', error);
      return [];
    }
  }

  async getSupportedLocales(): Promise<Array<{ code: string; metadata?: LocaleMetadata }>> {
    await this.init();
    if (!this.db) return [];
    
    try {
      const allData = await this.db.getAll(STORE_NAME);
      
      return allData.map(data => ({
        code: data.locale,
        metadata: data.metadata,
      }));
    } catch (error) {
      console.error('Error getting supported locales:', error);
      return [];
    }
  }

  async processApiResponse(locale: string, response: ApiResponse): Promise<TranslationData> {
    // Handle different response formats dynamically
    let translations: TranslationData = {};
    
    // Check for translations in various possible locations
    if (response.translations) {
      translations = response.translations;
    } else if (response.data) {
      translations = response.data;
    } else if (typeof response === 'object' && !response.error) {
      // Direct translation object - must be TranslationData format
      translations = response as TranslationData;
    }
    
    // Store with API metadata
    await this.setTranslations(locale, translations, response);
    
    return this.processTranslations(translations);
  }
}

export const storage = new TranslationStorage();