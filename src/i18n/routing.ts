import { defineRouting } from 'next-intl/routing';

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const routing = defineRouting({
    // Supported languages
    locales,

    // Default language
    defaultLocale,

    // URL 路径策略: 按需显示语言前缀
    localePrefix: 'as-needed'
});
