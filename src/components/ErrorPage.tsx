"use client";

import type { FC } from "react";
import { Icons } from "./Icons";

interface IErrorPage {
  type: string;
}

const ErrorPage: FC<IErrorPage> = ({ type }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      {type === "NOT_FOUND" ? (
        <div className="flex grow flex-col items-center justify-center gap-y-2 text-3xl tracking-tighter">
          <Icons.heartBreak className="size-24" />
          No link related to that slug found sadly
        </div>
      ) : null}
    </div>
  );
};

export default ErrorPage;
