"use client";

import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  async function handleSignIn() {
    await signIn("discord");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <h1 className="mt-24 text-9xl font-extrabold italic tracking-tight">
        ZapLink
      </h1>
      <Button
        onClick={handleSignIn}
        variant={"link"}
        className="peer mt-12 text-gray-400 hover:font-bold hover:italic hover:text-yellow-400"
        size={"lg"}
      >
        Sign In
      </Button>
      <p className="hidden font-bold italic text-yellow-400 peer-hover:block">
        To zap to your links
      </p>
    </div>
  );
};

export default SignInPage;
