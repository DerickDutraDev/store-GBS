// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Tenta obter a sessão e atualizá-la
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se for uma rota protegida e não houver sessão, redireciona para o login
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Se for uma rota protegida, mas o usuário não for admin, redireciona
  if (isAdminRoute && session && session.user.user_metadata.is_admin !== true) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};