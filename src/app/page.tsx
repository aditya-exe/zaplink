import AddLink from "@/components/AddLink";
import SignIn from "@/components/SignIn";
import { getServerAuthSession } from "@/server/auth";

const Home = async () => {
  const session = await getServerAuthSession();

  return (
    <div
      className={
        "flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400"
      }
    >
      <h1 className={"mt-24 text-9xl font-extrabold italic tracking-tight"}>
        ZapLink
      </h1>
      {session ? <AddLink /> : <SignIn />}
    </div>
  );
};

export default Home;
