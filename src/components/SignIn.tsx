import Link from "next/link";
import { buttonVariants } from "./ui/button";

const SignIn = () => {
  return (
    <>
      <Link
        href={"/api/login/discord"}
        className={buttonVariants({
          variant: "link",
          className:
            "peer mt-12 text-neutral-100 hover:font-bold hover:italic hover:text-yellow-400",
        })}
      >
        Sign In
      </Link>
      <p className="hidden font-bold italic text-yellow-400 peer-hover:block">
        To zap to your links
      </p>
    </>
  );
};

export default SignIn;
