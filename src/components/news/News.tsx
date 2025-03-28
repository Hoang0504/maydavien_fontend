"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { News as NewsModel } from "@/models/News";
import { normalizeObject } from "@/utils";
import { getNews } from "@/services/newsService";
import { useLoading } from "@/context/loadingContext";
import NotFoundPage from "@/components/NotFoundPage";
import PaginationBar from "@/components/PaginationBar";
import routes from "@/config";

function News() {
  const { setLoading } = useLoading();
  const [news, setNews] = useState<NewsModel[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchNewsData = async () => {
    setLoading(true);
    const response = await getNews({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    const normalizedData = normalizeObject(
      response.data
    ) as unknown as NewsModel[];
    setNews(normalizedData);
    setTotalPages(
      response.total_pages ? parseInt(response.total_pages.toString()) : 0
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchNewsData();
  }, [page]);

  if (!news) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">TIN TỨC</h1>
      <div className="flex flex-col gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex border rounded-lg shadow-lg overflow-hidden"
          >
            <Link
              href={`${routes.news}/${item.slug}.html`}
              className="text-red-600 font-semibold w-1/3 h-[300px] relative"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                loading="lazy"
              />
            </Link>

            <div className="p-4 w-2/3">
              <Link
                href={`${routes.news}/${item.slug}.html`}
                className="text-red-600 font-semibold"
              >
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              </Link>

              <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {item.content}
              </p>
              <Link
                href={`${routes.news}/${item.slug}.html`}
                className="text-red-600 font-semibold"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        ))}
      </div>

      <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default News;
