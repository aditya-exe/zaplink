import { redirect } from "next/navigation";
import SignIn from "~/components/SignIn";
import {  validateRequest } from "~/server/auth/lucia";

const Home = async () => {
  const { session } = await validateRequest();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <h1 className="mt-24 text-9xl font-extrabold italic tracking-tight">
        ZapLink
      </h1>
      <SignIn />
    </div>
  );
};

export default Home;
