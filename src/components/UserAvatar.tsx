"use client";

import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icons } from "./Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface IUserAvatar {
  userImage: string;
  userName: string;
}

const UserAvatar: FC<IUserAvatar> = ({ userName, userImage }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark w-56 rounded-md border-2 border-yellow-400 bg-neutral-800 shadow-lg">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link href={`/me`} className={buttonVariants({ variant: "link" })}>
            Manage your account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-yellow-400" />
        <DropdownMenuItem>
          <Link
            href="/api/log-out"
            className={buttonVariants({
              variant: "link",
              className: "flex items-center gap-x-1",
            })}
          >
            <Icons.logout />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
