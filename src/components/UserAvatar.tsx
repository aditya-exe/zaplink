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
import { signOut } from "next-auth/react";
import { Icons } from "./Icons";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

interface IUserAvatar {
  userImage: string;
  userName: string;
  userId: string;
}

const UserAvatar: FC<IUserAvatar> = ({ userName, userId, userImage }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark w-56 bg-neutral-800 shadow-lg border-2 rounded-md border-yellow-400">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            href={`/user/${userId}`}
            className={buttonVariants({ variant: "link" })}
          >
            Manage your account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-yellow-400" />
        <DropdownMenuItem>
          <Button
            onClick={() => signOut()}
            variant={"link"}
            className="flex items-center gap-x-1"
          >
            <Icons.logout />
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
