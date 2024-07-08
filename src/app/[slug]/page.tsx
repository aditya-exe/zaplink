import { redirect } from "next/navigation";
import ErrorPage from "~/components/ErrorPage";
import { api } from "~/trpc/server";

const SlugRedirect = async ({ params }: { params: { slug: string } }) => {
  const link = await api.link.getLink({ slug: params.slug });

  if (!link) {
    return <ErrorPage type={"NOT_FOUND"} />;
  }

  redirect(link.url);
};

export default SlugRedirect;
