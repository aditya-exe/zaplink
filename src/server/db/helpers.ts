import { eq } from "drizzle-orm";
import { db } from ".";
import {
  accounts,
  sessions,
  users,
  type User,
  type Account,
  type Session,
} from "./schema";
import { type DiscordUser } from "~/app/api/login/discord/callback/route";
import { type Result, Err, Ok, type Option, isOk, None } from "rustic";

export async function getAccountByDiscordId(
  discordId: string,
): Promise<Option<Account>> {
  try {
    return await db.query.accounts.findFirst({
      where: eq(accounts.userId, discordId),
    });
  } catch (e) {
    console.error(e);
  }
}

export async function createDiscordUser(
  discordUser: DiscordUser,
): Promise<Result<string, string>> {
  let existingUser = await getUserById(discordUser.id);

  if (!existingUser) {
    const newUser = await createUser(discordUser);
    if (isOk(newUser)) {
      existingUser = newUser.data;
    }
  }

  if (existingUser) {
    await createAccountViaDiscord(existingUser.id);
    return Ok(existingUser.id);
  }

  return Err("ERROR: Cannot create new discord User");
}

export async function getUserById(id: string): Promise<Option<User>> {
  try {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  } catch (e) {
    console.error(e);
  }
}

export async function createUser(
  discordUser: DiscordUser,
): Promise<Result<User, unknown>> {
  try {
    const [user] = await db
      .insert(users)
      .values({
        id: discordUser.id,
        username: discordUser.username,
        image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        email: discordUser.email,
      })
      .returning();

    if (!user) {
      throw new Error("ERROR: Cannot create user");
    }

    return Ok(user);
  } catch (e) {
    console.error(e);
    return Err(e);
  }
}

export async function createAccountViaDiscord(
  userId: string,
): Promise<Result<boolean, unknown>> {
  try {
    await db
      .insert(accounts)
      .values({
        userId,
        provider: "discord",
      })
      .onConflictDoNothing();

    return Ok(true);
  } catch (e) {
    console.error(e);
    return Err(e);
  }
}

export async function getAllSessionsFromIp(
  ip: string | undefined,
): Promise<Option<Session[]>> {
  if (!ip) {
    return None;
  }

  return await db.select().from(sessions).where(eq(sessions.ip, ip));
}
