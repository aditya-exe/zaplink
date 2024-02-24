"use client";

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

const SignIn = () => {
	return (
		<>
			<Button onClick={() => signIn("discord")} variant={"link"}
			        className={"text-gray-400 hover:text-yellow-400 hover:italic hover:font-bold peer mt-12"} size={"lg"}>
				Sign In
			</Button>
			<p className={"text-yellow-400 italic font-bold hidden peer-hover:block"}>To zap to your links</p>
		</>
	);
};

export default SignIn;