"use client";

import { type ChangeEvent, useState, type FC } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "./Icons";
import { type User } from "lucia";
import { api } from "~/trpc/react";
import { LoaderButton } from "./ui/loader-button";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IEditProfile {
  user: User;
}

const EditProfile: FC<IEditProfile> = ({ user }) => {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [newAvatar, setNewAvatar] = useState<string>();
  const { mutate, isPending } = api.user.editProfile.useMutation({
    onSuccess: () => {
      toast({
        description: "Profile updated successfully!",
      });
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
      toast({
        description: "Could not update Profile, Please try again!",
        variant: "destructive",
      });
    },
  });

  function handleUpdate() {
    mutate({
      newUsername,
      newAvatar,
    });
  }

  function handleSelectImage(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result !== undefined) {
        const compressedImage = readerEvent.target.result as string;
        setNewAvatar(compressedImage);
      }
    };
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 flex items-center gap-x-2 text-yellow-400 ring-2 ring-yellow-700 hover:text-yellow-600 hover:ring-yellow-400">
          <Icons.edit size={20} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="dark text-neutral-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              className="col-span-3"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar
            </Label>
            <Input
              id="avatar"
              type="file"
              onChange={handleSelectImage}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <LoaderButton
            isLoading={isPending}
            type="submit"
            onClick={handleUpdate}
          >
            Save changes
          </LoaderButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
