import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix } from '@/navigation/navigation';
import { NextRequest, NextResponse } from 'next/server';
const intlMiddleware = createMiddleware({
  defaultLocale: 'en',
  localePrefix,
  locales,
});
const publicPages: string[] = [
  '/',
  '/login',
  '/registration',
  '/en/registration',
  '/uk/registration',
  '/pl/registration',
  '/en/login',
  '/uk/login',
  '/pl/login',
  '/en/tooManyRequest',
  '/uk/tooManyRequest',
  '/pl/tooManyRequest',
];

async function checkAuth(req: NextRequest) {
  const accessToken = req.cookies.get('access_token');
  const originalURL = `${req.nextUrl.protocol}//${req.headers.get('host')}${req.nextUrl.pathname}`;
  if (!accessToken) {
    return false;
  }
  console.log(
    `[MIDDLEWARE] verifying access token: ${accessToken?.value.length > 0}`,
  );

  try {
    const res = await fetch('http://backend:5000/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `access_token=${accessToken?.value}`,
      },
      credentials: 'include',
    });
    console.log(
      `[MIDDLEWARE] verifying status: ${res.status} | ${res.statusText}`,
    );
    if (res.status === 401) {
      const redirectURL = new URL('/refresh-token', req.url);
      redirectURL.searchParams.set('redirect', originalURL);
      return NextResponse.redirect(redirectURL);
    } else if (res.status === 429) {
      const redirectURL = new URL(`/tooManyRequest`, req.url);

      return new NextRequest(redirectURL);
    } else return res.statusText === 'OK';
  } catch (e) {
    console.log('[MIDDLEWARE] Error after validate: ', e);
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`[MIDDLEWARE] Start: ${pathname}`);
  const isPublicPage = publicPages.includes(pathname);
  if (isPublicPage) {
    return intlMiddleware(req);
  }
  if (pathname === '/refresh-token') {
    return NextResponse.next();
  }

  const isAuthorized: boolean | NextResponse | any = await checkAuth(req);

  if (isAuthorized === true) {
    return intlMiddleware(req);
  } else if (isAuthorized instanceof NextResponse) {
    return isAuthorized;
  } else if (isAuthorized instanceof NextRequest) {
    return intlMiddleware(isAuthorized);
  } else return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
