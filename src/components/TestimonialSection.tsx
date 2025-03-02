"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { getEvaluates } from "@/services/evaluateService";
import { Evaluate } from "@/models/Evaluate";

import { getImageResource } from "@/utils";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
function TestimonialSection() {
  const [evaluates, setEvaluates] = useState<Evaluate[]>([]);

  useEffect(() => {
    getEvaluates()
      .then((res) => setEvaluates(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-gray-100">
      <section className="container mx-auto py-10">
        <h2 className="text-center text-3xl font-bold mb-8">
          KHÁCH HÀNG NÓI VỀ CHÚNG TÔI
        </h2>
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={3}
          pagination={{ clickable: true }}
        >
          {evaluates.map((evaluate) => (
            <SwiperSlide key={evaluate.id}>
              <div className="p-6 border rounded-lg shadow-lg bg-white h-[194px]">
                <div className="flex items-center mb-4">
                  <Image
                    src={getImageResource(evaluate.avatar)}
                    alt={evaluate.email}
                    width={12}
                    height={12}
                    objectFit="cover"
                    className="w-12 h-12 border-4 border-blue-500 rounded-full mr-2"
                    unoptimized
                  />
                  <div>
                    <h3 className="font-bold leading-none">{evaluate.name}</h3>
                    <span className="text-gray-500 text-xs">
                      {evaluate.email}
                    </span>
                    <div className="text-yellow-500 leading-none">
                      {"★".repeat(evaluate.rate)}
                    </div>
                  </div>
                </div>
                <p className="line-clamp-3">{evaluate.content}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}

export default TestimonialSection;
