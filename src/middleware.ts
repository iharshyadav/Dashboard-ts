import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/admin/login'

  const token = request.cookies.get('auth')?.value || '';
  console.log('Token:', token);


  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
  }
    
}

 
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/faculty',
    '/dashboard/achievement',
  ]
}