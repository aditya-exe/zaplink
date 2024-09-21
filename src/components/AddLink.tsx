"use client";

import { type User } from "next-auth";
import { type FC } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import AddLinkDrawer from "./AddLinkDrawer";

interface IAddLink {
  user: User;
}

const AddLink: FC<IAddLink> = () => {
  return (
    <Card className="h-full w-[350px] bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-xl font-bold italic tracking-tight text-neutral-300">
          Add new link
        </CardTitle>
        <CardDescription>Shorten your link</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <AddLinkDrawer />
      </CardFooter>
    </Card>
  );
};

export default AddLink;
