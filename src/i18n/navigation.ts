//navigation.ts
// This file is used to configure the i18n routing for the application
// and to provide the correct navigation functions for the application.
// It is used in the `src/app/[locale]/layout.tsx` file to provide the
// correct navigation functions to the application.
// The `createNavigation` function is used to create the navigation
// functions for the application
// The `Link`, `redirect`, `usePathname`, `useRouter`, and `getPathname`
// functions are used to navigate between pages in the application.
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
 
// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);