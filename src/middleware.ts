"use server";
import { NextRequest, NextResponse } from "next/server";

async function verifyToken(token: string | null, req: NextRequest) {
  if (!token) {
    console.log("Token is missing.");
    return { isValid: false, role: null };
  }

  try {
    console.log("Verifying token...");
    const response = await fetch(new URL("/api/verify", req.url), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log("Token verification response:", data);

    return { isValid: data.isValid, role: data.role };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { isValid: false, role: null };
  }
}

function getRequiredRedirectUrl(
  pathname: string,
  role: string | null,
  token: string | null
): string | null {
  switch (pathname) {
    case "/login":
      return token ? "/" : null;
    case "/":
      return token ? null : "/login";
    case "/register":
      if (!token) return "/login";
      if (role !== "superadmin") return "/";
      return null;
    case "/logout":
      return token ? null : "/login";
    default:
      return token ? null : "/";
  }
}

async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("Current pathname:", pathname);

  const token = request.cookies.get("token")?.value || null;
  console.log("Token:", token);

  const { isValid, role } = await verifyToken(token, request);
  console.log("Token validation result:", { isValid, role });

  const redirectTo = getRequiredRedirectUrl(pathname, role, token);

  if (redirectTo) {
    console.log("Redirecting to:", redirectTo);
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
}

export default middleware;

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/logout",
    "/add-cases",
    "/add-blogs",
    "/add-services",
    "/all-services",
    "/all-blogs",
    "/all-cases",
    "/users",
  ],
};

export const dynamic = "force-dynamic";
