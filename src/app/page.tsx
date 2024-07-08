import AddLink from "~/components/AddLink";
import SignIn from "~/components/SignIn";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

const Home = async () => {
  const session = await getServerAuthSession();
  const t = await db.query.test.findMany();

  console.log(t)
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <h1 className="mt-24 text-9xl font-extrabold italic tracking-tight">
        ZapLink
      </h1>
      {session ? (
        <div className="mt-6 flex justify-center">
          <AddLink user={session.user} />
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default Home;
