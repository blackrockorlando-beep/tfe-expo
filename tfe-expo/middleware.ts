import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({ request });
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Admin protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));
    const email = user.email?.toLowerCase() ?? "";
    if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url));
    }
  }

  // Franchisor protection
  if (pathname.startsWith("/franchisor") && !pathname.startsWith("/franchisor/login")) {
    if (!user) return NextResponse.redirect(new URL("/franchisor/login", request.url));
  }
// Presenter protection
if (pathname.startsWith("/presenter") && !pathname.startsWith("/presenter/login")) {
  if (!user) return NextResponse.redirect(new URL("/presenter/login", request.url));
}

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!user) return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};