// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-next-pathname", request.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    pages: {
      signIn: "/st-admin", // redirect for unauthenticated users
    },
  },
);

// Only match protected admin routes
export const config = {
  matcher: ["/v2/admin/:path*"],
};
