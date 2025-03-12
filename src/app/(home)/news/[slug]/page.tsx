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

export default function NewsDetail() {
  const { setLoading } = useLoading();
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getNewsBySlug(slug);
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
      <Image
        src={news.image}
        alt={news.title}
        width={800}
        height={500}
        className="object-cover mx-auto rounded-lg shadow-lg mb-6"
        loading="lazy"
      />
      <div className="text-lg">{news.content}</div>
    </div>
  );
}
