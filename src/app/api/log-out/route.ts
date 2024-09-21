import { lucia, validateRequest } from "~/server/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const req = await validateRequest();
  if (req) {
    const { session } = req;

    if (!session) {
      redirect("/sign-in");
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    redirect("/");
  }
}
