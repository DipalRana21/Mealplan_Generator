import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/webhook(.*)",
  "/api/create-profile",
  "/api/check-subscription(.*)",
]);

const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname, origin } = req.nextUrl;

  if(pathname === "/api/check-subscription") {
    return NextResponse.next();
  }

  // ✅ Allow API routes without redirect
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }

  if(isMealPlanRoute(req) && userId) {
    try {
      const response = await fetch((`${origin}/api/check-subscription?userId=${userId}`))
      const data = await response.json();

      if(!data.subscriptionActive) {
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error: any) {
      return NextResponse.redirect(new URL("/subscribe", origin));
      
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};
