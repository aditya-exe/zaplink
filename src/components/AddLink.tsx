"use client";

import { nanoid } from "nanoid";
import { type User } from "next-auth";
import Link from "next/link";
import { useState, type FC } from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Icons } from "./Icons";

interface IAddLink {
  user: User;
}

const AddLink: FC<IAddLink> = () => {
  // const url = window.location.origin;
  const [userSlug, setUserSlug] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const { data: valid, isLoading } = api.link.slugCheck.useQuery(
    {
      slug: userSlug,
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  const { mutate } = api.link.createSlug.useMutation();

  function handleGenerateSlug() {
    setUserSlug(nanoid(10));
  }

  function handleAdd() {
    mutate({ slug: userSlug, url });
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-xl font-bold">Add new link</h2>
      <div className="mt-4 grid grid-cols-3 items-center gap-x-5 gap-y-4">
        <p className="text-lg">zplnk.vercel.app/</p>
        <Input
          value={userSlug}
          className="font-bold"
          onChange={(e) => setUserSlug(e.target.value)}
        />
        <div className="flex items-center gap-x-2">
          <Button
            onClick={handleGenerateSlug}
            className="bg-yellow-400 text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200"
          >
            Random Slug Generate
          </Button>
          {userSlug.length > 0 ? (
            <Checker isLoading={isLoading} valid={valid ?? false} />
          ) : null}
        </div>
        <p className="text-lg">Link: </p>
        <Input
          value={url}
          className="col-span-2.5 w-full"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-x-4">
        <Button
          size={"lg"}
          className="min-w-xl mt-6 gap-x-1 bg-yellow-400 tracking-tight text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200"
          onClick={handleAdd}
        >
          Add
          <Icons.zap />
        </Button>
        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "lg",
            className:
              "min-w-xl mt-6 flex items-center gap-x-2 bg-yellow-400 tracking-tight text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200",
          })}
        >
          Go to Dashboard
          <Icons.arrowRight />
        </Link>
      </div>
    </div>
  );
};

export default AddLink;

const Checker = ({
  isLoading,
  valid,
}: {
  isLoading: boolean;
  valid: boolean;
}) => {
  return isLoading ? (
    <Icons.loading className="animate-spin" />
  ) : valid === true ? (
    <Icons.check />
  ) : (
    <Icons.error />
  );
};
