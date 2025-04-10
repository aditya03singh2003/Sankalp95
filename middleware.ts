import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/fee-details",
    "/lectures",
    "/courses",
    "/t-shirts",
    "/login",
    "/register",
    "/forgot-password",
    "/api/email",
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // API routes that should be ignored
  const isApiRoute = pathname.startsWith("/api/webhook")

  // If it's a public route or API route, allow access
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = await getToken({ req: request })

  // If no token and trying to access protected route, redirect to login
  if (!token && pathname.startsWith("/dashboard")) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
