import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // ✅ Allow API routes without redirect
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
