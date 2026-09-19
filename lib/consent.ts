export interface CookieConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: number;
}

export const CONSENT_STORAGE_KEY = 'emuser_cookie_consent';
export const CURRENT_CONSENT_VERSION = 1;

export const DEFAULT_CONSENT: CookieConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: CURRENT_CONSENT_VERSION,
};

export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.essential === 'boolean') {
      return parsed as CookieConsentPreferences;
    }
  } catch (err) {
    console.warn('Failed to parse stored cookie consent:', err);
  }
  return null;
}

export function saveConsent(preferences: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const updated: CookieConsentPreferences = {
    essential: true, // Essential storage is strictly required
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    timestamp: new Date().toISOString(),
    version: CURRENT_CONSENT_VERSION,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('emuser-consent-changed', { detail: updated }));
    } catch (err) {
      console.error('Failed to save cookie consent to localStorage:', err);
    }
  }

  return updated;
}

export function openCookieSettingsModal(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  }
}
