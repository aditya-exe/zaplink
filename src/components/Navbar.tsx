"use client";

import { type User } from "next-auth";
import type { FC } from "react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

interface INavbar {
  user: User;
}

const Navbar: FC<INavbar> = ({ user }) => {
  return (
    <div className="flex w-full justify-between bg-transparent p-4 shadow-lg">
      <div className="flex items-center gap-x-5">
        <Link
          href="/"
          className="text-4xl font-extrabold italic tracking-tighter text-yellow-400"
        >
          Zaplink
        </Link>
      </div>
      <UserAvatar
        userName={user.name ?? ""}
        userId={user.id}
        userImage={user.image ?? ""}
      />
    </div>
  );
};

export default Navbar;
