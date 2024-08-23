import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// import { handleTokenExpiration } from "./utils/cookiesFunc";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (request.nextUrl.pathname === "/update_profile" && !token)
    return NextResponse.redirect(new URL("/", request.url));

  if (request.nextUrl.pathname.includes("/dashboard") && !token)
    return NextResponse.redirect(new URL("/", request.url));

  if (request.nextUrl.pathname.includes("/level_adviser/dashboard") && !token)
    return NextResponse.redirect(new URL("/level_adviser", request.url));

  return NextResponse.next();
}

// Supports both a single string value or an array of matchers
// export const config = {
//   matcher: '/dashboard/:path*',
// OR
//   matcher: [
//     "/update_profile",
//     "/dashboard/:path*",
//     "/level_adviser/dashboard/:path*",
//   ],
// };
