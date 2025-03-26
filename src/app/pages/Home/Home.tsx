"use client";

import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import Link from "next/link";
import Image from "next/image";

import { News } from "@/models/News";
import { getLatestNews } from "@/services/newsService";

import { useLoading } from "@/context/loadingContext";
import routes from "@/config";
import Banner from "@/components/Banner";
import CategoriesSection from "@/components/category/CategoriesSection";
import IntroduceSection from "@/components/IntroduceSection";
import ProductSection from "@/components/product/ProductSection";
import TestimonialSection from "@/components/TestimonialSection";

import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
  const { setLoading } = useLoading();
  const [news, setNews] = useState<News[]>([]);

  const fetchNewsData = async () => {
    setLoading(true);
    const data = await getLatestNews();
    setNews(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <Banner />
        <CategoriesSection id="danh-muc" />
      </div>
      <IntroduceSection id="gioi-thieu" />
      <ProductSection id="san-pham" />
      <TestimonialSection />
      <div>
        {/* News Section */}
        <div className="py-8 px-3">
          <h2 className="text-xl font-bold mb-4">TIN TỨC MỚI NHẤT</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto scrollbar-hide">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`${routes.news}/${item.slug}.html`}
                className="shadow-lg"
              >
                <div className="h-[250px] relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-2 text-center">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className={cx("bg-gray-100 py-5", "footer-margin-bottom")}>
          <div className="container mx-auto text-center">
            {/* Distribution System */}
            <h2 className="text-2xl font-bold my-8">
              HỆ THỐNG PHÂN PHỐI CỦA NHẬT ANH
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="text-center">
                <h3 className="font-semibold">TRỤ SỞ CÔNG TY NHẬT ANH</h3>
                <p className="text-sm">
                  Thôn 3 - Vạn Phúc - Thanh Trì - Hà Nội
                </p>
                <span className="text-red-500">📍 Bản đồ đường đi</span>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3726.846258178946!2d105.89983267601085!3d20.918504191554984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ae2255555555%3A0x3c22052ac407c43a!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gUXXhu5FjIFThur8gTmjhuq10IEFuaA!5e0!3m2!1svi!2s!4v1740835182458!5m2!1svi!2s"
                  width="300"
                  height="200"
                  className="mx-auto mt-2 transform transition-all duration-700 hover:scale-110"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
