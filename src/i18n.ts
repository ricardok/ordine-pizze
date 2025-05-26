import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['pt', 'en', 'it'] as const;

// @ts-expect-error - next-intl getRequestConfig has incorrect type signature for locale parameter
export default getRequestConfig(async ({locale}: { locale: string }) => {
  if (!locales.includes(locale as typeof locales[number])) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 