"use client";

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

const SignInPage = () => {
	async function handleSignIn() {

		await signIn("discord");
	}

	return (
		<div className={"flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400"}>
			<h1 className={"text-9xl font-extrabold italic tracking-tight mt-24"}>
				ZapLink
			</h1>
			<Button onClick={handleSignIn} variant={"link"}
			        className={"text-gray-400 hover:text-yellow-400 hover:italic hover:font-bold peer mt-12"} size={"lg"}>
				Sign In
			</Button>
			<p className={"text-yellow-400 italic font-bold hidden peer-hover:block"}>To zap to your links</p>
		</div>
	);
};

export default SignInPage;