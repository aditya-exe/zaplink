"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons } from "./Icons";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { type Link as DbLink } from "~/server/db/schema";
import { type User } from "lucia";
import { type LinkWithUser } from "~/server/api/routers/link";

export const linkColumns: ColumnDef<LinkWithUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: unknown) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const link = row.original;

      return (
        <Link
          href={`/projects/${link.id}`}
          className={buttonVariants({ variant: "link" })}
        >
          {}
        </Link>
      );
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner
          <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;

      return (
        <Link href={`/user/`} className="flex select-none items-center">
          <Avatar>
            <AvatarImage
            // src={project.owner.image ?? ""}
            // alt={project.owner.name ?? "User image"}
            />
            {/* <AvatarFallback>{project.owner.name?.charAt(0)}</AvatarFallback> */}
          </Avatar>
          <p className={buttonVariants({ variant: "link" })}></p>
        </Link>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const link = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.options className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(link.id)}
            >
              Copy Project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/user/`}>View Owner</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/projects/`}>View Project details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DeleteProject linkId={link.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const DeleteProject = ({ linkId }: { linkId: string }) => {
  const router = useRouter();
  const { mutate } = api.link.deleteLinkById.useMutation({
    onSuccess: () => {
      toast({ description: "Project deleted successfully" });
      router.refresh();
    },
    onError: () => {
      toast({
        description: "Could not delete project",
        variant: "destructive",
      });
    },
  });

  return <div onClick={() => mutate({ linkId })}>Delete Project</div>;
};
