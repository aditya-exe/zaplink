// TODO FIX updoad retrieve

"use client";

import { useUpload } from "@supabase-cache-helpers/storage-react-query";
import Image from "next/image";
import { type ChangeEvent, type FC, useRef } from "react";
import {
  getRandomColor,
  getGradient,
  supabase,
  USER_HEADERS,
} from "~/lib/utils";
import { Icons } from "./Icons";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface IUserHeaderInfo {
  userId: string;
}

const UserHeaderImage: FC<IUserHeaderInfo> = ({ userId }) => {
  const colorGradient = getRandomGradient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = supabase.storage
    .from(USER_HEADERS)
    .getPublicUrl(`${userId}/header`);
  const { mutate: upload } = useUpload(supabase.storage.from(USER_HEADERS), {
    upsert: true,
    buildFileName: () => `${userId}/header`,
    onError: (err) => {
      console.error(err);
      toast({
        description: "Failed to upload header",
      });
    },
    onSuccess: () => {
      toast({
        description: "Updated header successfully",
      });
      router.refresh();
    },
  });

  function uploadFile(e: ChangeEvent<HTMLInputElement>) {
    let file;

    if (e.target.files) {
      file = e.target.files;
    }

    if (file !== undefined && e.target.files) {
      upload({
        files: [...file],
      });
    }
  }

  console.log({ userId, data, colorGradient });

  return (
    <div className="flex h-1/3 w-full flex-col">
      <div className="group h-full w-full">
        {!data ? (
          <div className="flex h-full w-full items-center justify-center">
            <Icons.loading className="size-8 animate-spin" />
          </div>
        ) : (
          <div className="relative h-full">
            {data ? (
              <div className="h-full w-full object-cover">
                <Image
                  src={data.publicUrl}
                  quality={100}
                  className="h-full w-full"
                  alt="user-header"
                  // loading="lazy"
                  width={10}
                  height={10}
                />
              </div>
            ) : (
              <div
                className={`to-neutral-30 bg-gradient h-full-to-br h-full w-full bg-red-200 from-yellow-300`}
              >
                hello
              </div>
            )}
            <div
              className="absolute bottom-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100"
              onClick={() => {
                if (inputRef?.current) {
                  inputRef.current.click();
                }
              }}
            >
              <Icons.imagePlus />
              <Input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={uploadFile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeaderImage;

function getRandomGradient() {
  const firstColor = getRandomColor();
  const secondColor = getRandomColor(firstColor);

  return getGradient(firstColor, secondColor);
}
