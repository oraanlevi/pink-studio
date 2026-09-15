// MAINTENANCE MODE — mobile only. Remove this file tomorrow to restore mobile.
export const config = {
  matcher: '/((?!maintenance\\.html|assets/).*)'
};

export default function middleware(request) {
  const ua = request.headers.get('user-agent') ?? '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

  if (isMobile) {
    return Response.redirect(new URL('/maintenance.html', request.url), 302);
  }
}
