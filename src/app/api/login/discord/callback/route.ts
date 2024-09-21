import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { isOk } from "rustic";
import { getIp } from "~/lib/get-ip";
import { discordAuth, setSession } from "~/server/auth/lucia";
import { createDiscordUser, getAccountByDiscordId } from "~/server/db/helpers";

export async function GET(req: Request): Promise<Response> {
  console.log("hello");
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("discord_oauth_state")?.value ?? null;
  const ip = getIp();
  console.log(ip);
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens;
  try {
    tokens = await discordAuth.validateAuthorizationCode(code);
    console.log("first");
    if (new Date() > tokens.accessTokenExpiresAt) {
      tokens = await discordAuth.refreshAccessToken(tokens.refreshToken);
    }
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const discordUser = (await response.json()) as DiscordUser;

    const existingAcc = await getAccountByDiscordId(discordUser.id);
    if (existingAcc) {
      await setSession(existingAcc.userId, ip ?? "fakeIp");
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const userId = await createDiscordUser(discordUser);

    if (isOk(userId)) {
      await setSession(userId.data, ip);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    } else {
      throw new Error(userId.data);
    }
  } catch (e) {
    console.log(e);

    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response("Somethin wong", {
      status: 500,
    });
  }
}

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  banner?: string | null;
  accent_color?: number | null;
  premium_type?: number;
  public_flags?: number;
  locale?: string;
  avatar_decoration?: string | null;
};
