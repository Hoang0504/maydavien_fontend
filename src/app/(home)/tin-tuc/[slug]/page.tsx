import type { Metadata } from "next";

import NewsDetail from "@/components/news/NewsDetail";
import { getNewsBySlug } from "@/services/newsService";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const newsSlug = params.slug.split(".html")[0];
  const news = await getNewsBySlug(newsSlug);

  return {
    title: news.data.title,
    openGraph: {
      title: news.data.title,
      type: "website",
      images: [news.data.image],
    },
  };
}

function Page() {
  return <NewsDetail />;
}

export default Page;
