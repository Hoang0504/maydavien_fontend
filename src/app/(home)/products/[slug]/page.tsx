"use client";

import Link from "next/link";
import Image from "next/image";
import Viewer from "viewerjs";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { Product } from "@/models/Product";
import { useLoading } from "@/context/loadingContext";
import { getProductBySlug } from "@/services/productService";
import routes from "@/config";
import NotFoundPage from "@/components/NotFoundPage";
export default function ProductDetail() {
  const { setLoading } = useLoading();

  const galleryRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProductData = async () => {
    setLoading(true);
    const data = await getProductBySlug(slug);
    setProduct(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (galleryRef.current) {
      viewerRef.current = new Viewer(galleryRef.current);
    }

    return () => {
      viewerRef.current?.destroy();
    };
  }, [product]);

  if (!product) return <NotFoundPage />;
  return (
    <div className="container mx-auto py-10">
      <div className="breadcrumb text-orange-600 font-normal mb-4">
        <Link href={routes.home}>Trang chủ</Link> {">"}{" "}
        <Link href={routes.categories + "/" + product?.category?.slug}>
          {product?.category?.name}
        </Link>{" "}
        {">"} <span>{product.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center" ref={galleryRef}>
          {/* <div className=""> */}
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-lg w-3/5 mb-4 object-cover"
          />
          {/* </div> */}
          <Swiper
            spaceBetween={0}
            slidesPerView={4}
            slidesPerGroup={1}
            loop={product.images?.length > 1 || false}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full grid grid-cols-3 gap-4"
          >
            {product.images.map((img: string, i: number) => (
              <SwiperSlide key={i}>
                <Image
                  src={img}
                  alt={product.name}
                  width={200}
                  height={150}
                  className="rounded-lg w-full aspect-square object-cover cursor-pointer hover:scale-105 transition-all duration-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Section */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-6">
            <span className="text-2xl font-semibold text-red-500">
              {product.price.toLocaleString()} đ
            </span>
            {product.old_price && (
              <span className="text-lg text-gray-500 line-through ml-4">
                {product.old_price.toLocaleString()} đ
              </span>
            )}
          </div>
          <div className="bg-gray-100 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Thông số kỹ thuật</h3>
            <ul className="space-y-2">
              {product.attributes.map(
                (attr: { id?: number; name: string; value: string }) => (
                  <li key={attr.id} className="flex justify-between">
                    <span>{attr.name}:</span>
                    <span className="font-semibold">{attr.value}</span>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="mt-6 p-5 bg-yellow-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Khuyến mãi</h3>
            <p>- Miễn phí vận chuyển trong nội thành</p>
            <p>- Tặng kèm bộ lọc nước</p>
            <p>- Bảo hành 12 tháng</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3 text-center">
          Mô tả sản phẩm
        </h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
}
