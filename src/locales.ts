import { LocaleInfo } from './types';

/**
 * Available locales following BCP 47 standard (IETF language tags)
 * Format: language[-script][-region]
 * Examples: en, en-US, zh-CN, zh-Hans-CN
 * 
 * These locale codes must match exactly what's in your database
 * Following the same standard as react-i18next
 */
export const AVAILABLE_LOCALES: LocaleInfo[] = [
  // English variants
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', enabled: true },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', direction: 'ltr', enabled: true },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', direction: 'ltr', enabled: true },
  
  // Chinese variants - using script subtags
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', enabled: true },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', enabled: true },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', enabled: true },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文', direction: 'ltr', enabled: true },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', nativeName: '繁體中文', direction: 'ltr', enabled: true },
  
  // Spanish variants
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', enabled: true },
  { code: 'es-ES', name: 'Spanish (Spain)', nativeName: 'Español (España)', direction: 'ltr', enabled: true },
  { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)', direction: 'ltr', enabled: true },
  
  // Portuguese variants
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', enabled: true },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', direction: 'ltr', enabled: true },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)', direction: 'ltr', enabled: true },
  
  // French variants
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', enabled: true },
  { code: 'fr-FR', name: 'French (France)', nativeName: 'Français (France)', direction: 'ltr', enabled: true },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)', direction: 'ltr', enabled: true },
  
  // German variants
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', enabled: true },
  { code: 'de-DE', name: 'German (Germany)', nativeName: 'Deutsch (Deutschland)', direction: 'ltr', enabled: true },
  { code: 'de-AT', name: 'German (Austria)', nativeName: 'Deutsch (Österreich)', direction: 'ltr', enabled: true },
  { code: 'de-CH', name: 'German (Switzerland)', nativeName: 'Deutsch (Schweiz)', direction: 'ltr', enabled: true },
  
  // Other languages
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', enabled: true },
  { code: 'it-IT', name: 'Italian (Italy)', nativeName: 'Italiano (Italia)', direction: 'ltr', enabled: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', enabled: true },
  { code: 'ja-JP', name: 'Japanese (Japan)', nativeName: '日本語 (日本)', direction: 'ltr', enabled: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', enabled: true },
  { code: 'ko-KR', name: 'Korean (Korea)', nativeName: '한국어 (대한민국)', direction: 'ltr', enabled: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', enabled: true },
  { code: 'ru-RU', name: 'Russian (Russia)', nativeName: 'Русский (Россия)', direction: 'ltr', enabled: true },
  
  // RTL languages
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', enabled: true },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية (المملكة العربية السعودية)', direction: 'rtl', enabled: true },
  { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', direction: 'rtl', enabled: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl', enabled: true },
  { code: 'he-IL', name: 'Hebrew (Israel)', nativeName: 'עברית (ישראל)', direction: 'rtl', enabled: true },
  
  // Other Asian languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', enabled: true },
  { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी (भारत)', direction: 'ltr', enabled: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', direction: 'ltr', enabled: true },
  { code: 'th-TH', name: 'Thai (Thailand)', nativeName: 'ไทย (ประเทศไทย)', direction: 'ltr', enabled: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', direction: 'ltr', enabled: true },
  { code: 'vi-VN', name: 'Vietnamese (Vietnam)', nativeName: 'Tiếng Việt (Việt Nam)', direction: 'ltr', enabled: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr', enabled: true },
  { code: 'id-ID', name: 'Indonesian (Indonesia)', nativeName: 'Bahasa Indonesia (Indonesia)', direction: 'ltr', enabled: true },
  
  // European languages
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', direction: 'ltr', enabled: true },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', nativeName: 'Nederlands (Nederland)', direction: 'ltr', enabled: true },
  { code: 'nl-BE', name: 'Dutch (Belgium)', nativeName: 'Nederlands (België)', direction: 'ltr', enabled: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', enabled: true },
  { code: 'pl-PL', name: 'Polish (Poland)', nativeName: 'Polski (Polska)', direction: 'ltr', enabled: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', enabled: true },
  { code: 'tr-TR', name: 'Turkish (Turkey)', nativeName: 'Türkçe (Türkiye)', direction: 'ltr', enabled: true },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', direction: 'ltr', enabled: true },
  { code: 'sv-SE', name: 'Swedish (Sweden)', nativeName: 'Svenska (Sverige)', direction: 'ltr', enabled: true },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', direction: 'ltr', enabled: true },
  { code: 'da-DK', name: 'Danish (Denmark)', nativeName: 'Dansk (Danmark)', direction: 'ltr', enabled: true },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', direction: 'ltr', enabled: true },
  { code: 'nb-NO', name: 'Norwegian Bokmål', nativeName: 'Norsk Bokmål', direction: 'ltr', enabled: true },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', direction: 'ltr', enabled: true },
  { code: 'fi-FI', name: 'Finnish (Finland)', nativeName: 'Suomi (Suomi)', direction: 'ltr', enabled: true },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', direction: 'ltr', enabled: true },
  { code: 'cs-CZ', name: 'Czech (Czech Republic)', nativeName: 'Čeština (Česká republika)', direction: 'ltr', enabled: true },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', direction: 'ltr', enabled: true },
  { code: 'hu-HU', name: 'Hungarian (Hungary)', nativeName: 'Magyar (Magyarország)', direction: 'ltr', enabled: true },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', direction: 'ltr', enabled: true },
  { code: 'el-GR', name: 'Greek (Greece)', nativeName: 'Ελληνικά (Ελλάδα)', direction: 'ltr', enabled: true },
];

/**
 * Get locale info by code
 */
export function getLocaleInfo(code: string): LocaleInfo | undefined {
  return AVAILABLE_LOCALES.find(locale => locale.code === code);
}

/**
 * Check if a locale code is supported
 */
export function isLocaleSupported(code: string): boolean {
  return AVAILABLE_LOCALES.some(locale => locale.code === code);
}

/**
 * Get fallback locale code
 * For example: en-US -> en, zh-CN -> zh
 */
export function getFallbackLocale(code: string): string | undefined {
  // Already a base locale
  if (!code.includes('-')) {
    return undefined;
  }
  
  // Extract base language code
  const baseCode = code.split('-')[0];
  return isLocaleSupported(baseCode) ? baseCode : undefined;
}

/**
 * Resolve locale with fallback
 * Tries the exact locale, then fallback to base language
 */
export function resolveLocale(code: string): string {
  // Exact match
  if (isLocaleSupported(code)) {
    return code;
  }
  
  // Try fallback
  const fallback = getFallbackLocale(code);
  if (fallback) {
    return fallback;
  }
  
  // Default to English
  return 'en';
}