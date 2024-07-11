import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const middleware = async (request) => {
  const path = request.nextUrl.pathname;

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isPublicPath = path === "/login" ? true : false;

  if ((isPublicPath && session) || (session && path === "/")) {
    return NextResponse.redirect(new URL("/playlist", request.nextUrl));
  }
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL("https://comedycatch.com/login"));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/players", "/songs", "/duty", "/login", "/playlist"],
};

