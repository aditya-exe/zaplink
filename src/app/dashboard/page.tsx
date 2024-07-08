import { redirect } from "next/navigation";
import Navbar from "~/components/Navbar";
import { getServerAuthSession } from "~/server/auth";

const Dashboard = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <Navbar user={session.user} />
    </div>
  );
};

export default Dashboard;
