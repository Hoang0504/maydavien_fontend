"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { Category } from "@/models/Category";
import { getCategories } from "@/services/categoryService";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection({ id }: { id: string }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then((b) => setCategories(b.data))
      .catch(console.error);
  }, []);

  return (
    <div id={id} className="text-center py-10">
      <h2 className="text-2xl font-bold mb-6">MÁY LÀM ĐÁ VIÊN NHẬT ANH</h2>
      <div className="mx-8">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          navigation
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <CategoryCard {...category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
