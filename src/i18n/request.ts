//request.ts
// This file is used to configure the i18n routing for the application
// and to load the appropriate messages for the requested locale.
// It is used in the `src/app/[locale]/layout.tsx` file to provide the
// correct locale and messages to the application.
// The `getRequestConfig` function is used to get the request config
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});