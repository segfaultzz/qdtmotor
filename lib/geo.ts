import type { Locale } from "./i18n";

// ISO country code (from the visitor's IP) -> site language. Unlisted countries fall back to the browser language.
const groups: Record<Exclude<Locale, "en">, string[]> = {
  zh: ["CN", "HK", "MO", "TW"],
  ar: ["SA", "AE", "EG", "IQ", "JO", "KW", "QA", "BH", "OM", "LB", "YE", "SY", "LY", "DZ", "MA", "TN", "SD", "PS", "MR"],
  es: ["ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR"],
  fr: ["FR", "SN", "CI", "CM", "ML", "BF", "NE", "GN", "BJ", "TG", "GA", "CG", "CD", "MG", "HT"],
  ru: ["RU", "BY", "KZ", "KG", "TJ"],
  bn: ["BD"],
};

const map = new Map<string, Locale>();
for (const [locale, countries] of Object.entries(groups)) for (const c of countries) map.set(c, locale as Locale);

export const GEO_COOKIE = "qdt-geo";
export const countryToLocale = (country?: string | null): Locale | undefined => (country ? map.get(country.toUpperCase()) : undefined);
