import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { request } from 'http';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/',
]);
export default clerkMiddleware((auth,request)=>{
  if (isProtectedRoute(request)) auth().protect();
  return NextResponse.next();
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};