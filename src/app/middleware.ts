import { NextResponse, type NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  // return NextResponse.redirect(new URL("/", request.url));
  // if (request.nextUrl.pathname === "/users") {
  //   return NextResponse.rewrite(new URL("/", request.url));
  // }
};

// export const config = {
//   matcher: "/about",
// };
