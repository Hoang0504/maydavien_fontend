"use client";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { News } from "@/models/News";
import { getNewsBySlug } from "@/services/newsService";
import { useLoading } from "@/context/loadingContext";
import routes from "@/config";
import NotFoundPage from "@/components/NotFoundPage";

function NewsDetail() {
  const { setLoading } = useLoading();
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const newsSlug = slug.split(".html")[0];
    const data = await getNewsBySlug(newsSlug);
    setNews(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  if (!news) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        href={routes.news}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Quay lại
      </Link>
      <h1 className="text-3xl font-bold text-center mb-8">{news.title}</h1>
      <div className="w-[300px] h-[300px] mx-auto mb-6 relative">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="mx-auto rounded-lg shadow-lg object-cover"
          loading="lazy"
        />
      </div>
      <div className="text-lg">{news.content}</div>
    </div>
  );
}

export default NewsDetail;
