"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { News } from "@/models/News";
import { getImageResource } from "@/utils";
import { getNews } from "@/services/newsService";

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    getNews()
      .then((res) => setNews(res))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">TIN TỨC</h1>
      <div className="flex flex-col gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex border rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              src={getImageResource(item.image)}
              alt={item.title}
              width={300}
              height={200}
              className="object-cover w-1/3 h-[350px]"
              unoptimized
            />
            <div className="p-4 w-2/3">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {item.content}
              </p>
              <Link
                href={`/news/${item.slug}`}
                className="text-red-600 font-semibold"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
