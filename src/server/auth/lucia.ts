import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Discord } from "arctic";
import { Lucia, TimeSpan, type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getBaseUrl } from "~/lib/utils";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(3, "d"),
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      username: attributes.username,
      email: attributes.email,
      image: attributes.image,
    };
  },
});

export async function validateRequest(): Promise<{
  session: Session | null;
  user: User | null;
}> {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? "";
  if (!sessionId) {
    return {
      session: null,
      user: null,
    };
  }

  const ctx = await lucia.validateSession(sessionId);

  try {
    if (!ctx.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    } else if (ctx.session) {
      if (!ctx.session.fresh) {
        if (new Date() < ctx.session.expiresAt) {
          ctx.session.fresh = true;
        }
      }
      const sessionCookie = lucia.createSessionCookie(ctx.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}

  return {
    session: ctx.session,
    user: ctx.user,
  };
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      username: string;
      email: string;
      image: string;
    };
  }
}

export const discordAuth = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  `${getBaseUrl()}/api/login/discord/callback`,
);

export const getCurrentUser = cache(async (): Promise<User | undefined> => {
  const { user } = await validateRequest();

  if (!user) {
    return undefined;
  }

  return user;
});

export async function assertAuthenticated(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
    // throw new Error("Please log in");
  }

  return user;
}

export async function setSession(
  userId: string,
  ip: string | undefined | null,
): Promise<void> {
  const session = await lucia.createSession(userId, { ip: ip });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
