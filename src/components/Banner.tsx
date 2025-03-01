"use client";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import Image from "next/image";
import { Banner as BannerModel } from "@/models/Banner";
import { getBanners } from "@/services/bannerService";
import { getImageResource } from "@/utils";

function Banner() {
  const [banners, setBanners] = useState<BannerModel[]>([]);

  useEffect(() => {
    getBanners()
      .then((b) => setBanners(b.data))
      .catch(console.error);
  }, []);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      slidesPerGroup={1}
      loop={banners?.length > 1 || false}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      modules={[Autoplay, Pagination, Navigation]}
      className="w-full h-[400px]"
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-[400px]">
            <Image
              src={getImageResource(banner.image)}
              alt={banner.title}
              width={1920}
              height={400}
              className="w-full h-[500px] object-cover"
              priority
              unoptimized
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Banner;
