//routing.ts
// This file is used to configure the i18n routing for the application
// and to provide the correct routing functions for the application.
// It is used in the `src/app/[locale]/layout.tsx` file to provide the
// correct routing functions to the application.
// The `defineRouting` function is used to define the routing
// configuration for the application
// The `routing` object is used to configure the routing
// for the application
// The `locales` array is used to define the supported locales
// The `defaultLocale` string is used to define the default locale
// The `routing` object is used to configure the routing
// for the application
import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});