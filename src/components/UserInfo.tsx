import { type User } from "lucia";
import { type FC } from "react";
import { Icons } from "./Icons";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import EditProfile from "./EditProfile";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface IUserInfo {
  user: User;
}

const UserInfo: FC<IUserInfo> = ({ user }) => {
  return (
    <div className="container mt-3 flex px-32">
      <div className="flex w-full flex-col items-center justify-center gap-x-8 p-4">
        <div className="flex w-full items-center justify-center gap-x-8">
          <Avatar className="size-[100px] ring-2 ring-yellow-700">
            <AvatarImage
              src={user.image}
              alt={`${user.username} Avatar`}
              className=""
            />
            <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center gap-y-3 p-4">
            <div className="flex items-center gap-x-4 text-3xl font-bold tracking-tight">
              <Icons.user />
              {user.username}
            </div>
            <h2 className="flex items-center gap-x-4 text-3xl font-bold tracking-tight">
              <Icons.email />
              {user.email}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <EditProfile user={user} />
          <Link
            href="/me/links"
            className={buttonVariants({
              className:
                "mt-4 flex items-center gap-x-2 text-yellow-400 ring-2 ring-yellow-700 hover:text-yellow-600 hover:ring-yellow-400",
            })}
          >
            <Icons.link size={20} />
            Your Links
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
