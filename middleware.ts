import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "./utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  let isAdmin = false;
  let authenticated = false;

  try {
    const session = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        const session = await fetchAuthSession(contextSpec);
        isAdmin =
          (
            session.tokens?.idToken?.payload["cognito:groups"] as string[]
          )?.[0] === "admin";
        return session;
      },
    });

    authenticated = !!session.tokens;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/admin") {
    if (!authenticated || !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/admin"],
};
