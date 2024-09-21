import Link from "next/link";
import { redirect } from "next/navigation";
import AddLink from "~/components/AddLink";
import Navbar from "~/components/Navbar";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { validateRequest } from "~/server/auth/lucia";

const Dashboard = async () => {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-neutral-800 text-yellow-400">
      <Navbar user={user} />
      <div className="grid w-full grid-cols-3 items-center gap-x-6 px-20 py-16">
        <Card className="w-[350px] bg-neutral-900 text-neutral-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold italic tracking-tight text-neutral-300">
              Your Links
            </CardTitle>
            <CardDescription>Links that you have shortened</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Link
              href={"/me/links"}
              className={buttonVariants({
                variant: "link",
                className: "text-neutral-300",
              })}
            >
              See links
            </Link>
          </CardFooter>
        </Card>
        <AddLink user={user} />
        <Card className="w-[350px] items-center bg-neutral-900 text-neutral-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold italic tracking-tight text-neutral-300">
              Your account
            </CardTitle>
            <CardDescription>Manage your settings</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Link
              href={"/me"}
              className={buttonVariants({
                variant: "link",
                className: "text-neutral-300",
              })}
            >
              Manage
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
