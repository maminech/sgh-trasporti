import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // Wait for the locale from the request
  let locale = await requestLocale;

  // Fallback to header if locale is not available
  if (!locale) {
    const headersList = await headers();
    locale = headersList.get('X-NEXT-INTL-LOCALE') || 'en';
  }

  return {
    locale,
    messages: (await import(`./i18n/locales/${locale}.json`)).default
  };
});
