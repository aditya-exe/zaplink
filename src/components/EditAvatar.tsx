"use client";

import { type FC, type ChangeEvent, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { TRPCError } from "@trpc/server";
import { toast } from "./ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { LoaderButton } from "./ui/loader-button";
import { X } from "lucide-react";

interface IEditAvatar {
  username: string;
  userImage: string;
}

const EditAvatar: FC<IEditAvatar> = ({ username, userImage }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<string>("");
  const router = useRouter();
  const { mutate, isPending } = api.user.changeImage.useMutation({
    onError: (err) => {
      if (err instanceof TRPCError) {
        console.error(err.cause);
        toast({
          variant: "destructive",
          description: err.message,
        });
      }
    },
    onSuccess: () => {
      toast({
        description: "Updated avater successfully",
      });
      setOpen((prev) => !prev);
      router.refresh();
    },
  });

  function addImage(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result !== undefined) {
        setNewImage(readerEvent.target?.result as string);
      }
    };
  }

  function handleClear() {
    setNewImage("");
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-4 flex items-center gap-x-8">
      <Avatar className="size-24">
        <AvatarImage src={userImage} alt={username} />
        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
      </Avatar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          <p
            className={buttonVariants({
              className:
                "select-none bg-yellow-400 tracking-tight text-neutral-900 hover:bg-yellow-800 hover:text-neutral-200",
            })}
          >
            Change Avatar
          </p>
        </DialogTrigger>
        <DialogContent className="dark text-neutral-300">
          <DialogHeader className="text-xl font-bold tracking-tight">
            Change your avatar
          </DialogHeader>
          <div className="flex items-center gap-x-2">
            <p>Select new avatar image</p>
            <Input
              type="file"
              className="w-fit"
              accept="image/*"
              onChange={addImage}
              ref={inputRef}
            />
          </div>
          <div className="mt-4 flex items-center justify-end gap-x-2">
            <LoaderButton
              isLoading={isPending}
              onClick={() => mutate({ newImage })}
            >
              Save
            </LoaderButton>
            <Button onClick={handleClear}>Clear</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EditAvatar;
