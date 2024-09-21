import Navbar from "~/components/Navbar";
import UserView from "~/components/UserView";
import { assertAuthenticated } from "~/server/auth/lucia";

const MePage = async () => {
  const user = await assertAuthenticated();

  return (
    <div className="flex h-screen flex-col items-center justify-start overflow-hidden bg-neutral-900 text-yellow-400">
      <Navbar user={user} />
      <UserView user={user} />
    </div>
  );
};

export default MePage;
