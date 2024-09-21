"use client";

import { type FC, useState } from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";
import { nanoid } from "nanoid";
import { Icons } from "./Icons";
import { toast } from "./ui/use-toast";
import { redirect } from "next/navigation";

const AddLinkDrawer: FC = () => {
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

  const { mutate } = api.link.createSlug.useMutation({
    onError: (err) => {
      console.error(err);
      toast({
        variant: "destructive",
        description: "Something went wrong, Please try again",
      });
    },
    onSuccess: (link) => {
      toast({ description: "Link added successfully" });
      redirect(`/me/link/${link.id}`);
    },
  });

  function handleGenerateSlug() {
    setUserSlug(nanoid(10));
  }

  function handleAdd() {
    mutate({ slug: userSlug, url });
  }

  function clearInput() {
    setUrl("");
    setUserSlug("");
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"link"} className="text-neutral-300">
          Add link
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-1/2 bg-neutral-900 text-white">
        <div className="mt-2 flex flex-col items-center">
          <div className="flex w-[40%] items-center gap-x-2">
            <p className="text-lg font-bold">zplnk.vercel.app/</p>
            <Input
              value={userSlug}
              className="w-fit text-lg font-bold text-neutral-900"
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
          </div>
          <div className="mt-6 flex w-[40%] items-center gap-x-2">
            <p className="text-lg font-bold">Link: </p>
            <Input
              value={url}
              className="text-lg font-bold text-neutral-900"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-x-4">
            <Button
              size={"lg"}
              className="min-w-xl mt-6 gap-x-1 bg-yellow-400 text-lg tracking-tight text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200"
              onClick={handleAdd}
              disabled={!valid}
            >
              Add
              <Icons.zap />
            </Button>
            <Button
              size={"lg"}
              className="min-w-xl mt-6 gap-x-1 bg-yellow-400 text-lg tracking-tight text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200"
              onClick={clearInput}
            >
              Clear
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddLinkDrawer;

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
