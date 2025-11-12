import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/admin/login";

  // Ако е администратор и опитва да достъпи login страницата, пренасочи към dashboard
  if (isLoginPage && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  // Ако не е логнат и опитва да достъпи admin панел (без login страницата)
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  // Ако е логнат но не е админ и опитва да достъпи admin панел
  if (isAdminRoute && !isLoginPage && isLoggedIn && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
