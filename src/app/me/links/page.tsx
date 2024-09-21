import { linkColumns } from "~/components/links-columns";
import Navbar from "~/components/Navbar";
import UserLinksTable from "~/components/UserLinksTable";
import { assertAuthenticated } from "~/server/auth/lucia";
import { api } from "~/trpc/server";

const MyLinksPage = async () => {
  const user = await assertAuthenticated();
  const dbLinks = await api.link.getLinksByUserId({ userId: user.id });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <Navbar user={user} />
      <UserLinksTable columns={linkColumns} data={dbLinks} />
    </div>
  );
};

export default MyLinksPage;
