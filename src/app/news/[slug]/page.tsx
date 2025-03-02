"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { News } from "@/models/News";
import { getImageResource } from "@/utils";
import { getNewsBySlug } from "@/services/newsService";
import routes from "@/config";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    getNewsBySlug(slug)
      .then((res) => setNews(res))
      .catch(console.error);
  }, [slug]);

  if (!news) return <p>Loading...</p>;

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
        src={getImageResource(news.image)}
        alt={news.title}
        width={800}
        height={500}
        className="object-cover mx-auto rounded-lg shadow-lg mb-6"
        unoptimized
      />
      <div className="text-lg">{news.content}</div>
    </div>
  );
}
