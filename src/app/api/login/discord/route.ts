import { generateState } from "arctic";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { discordAuth } from "~/server/auth/lucia";

export async function GET(_req: NextRequest): Promise<Response> {
  // const fresh = req.nextUrl.searchParams.get("fresh") ?? "false";
  const state = generateState();
  const url = await discordAuth.createAuthorizationURL(state, {
    scopes: ["email"],
  });

  // url.searchParams.set("fresh", fresh);
  // cookies().set("fresh", fresh);
  cookies().set("discord_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
