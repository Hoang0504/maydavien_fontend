"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Category } from "@/models/Category";
import { getCategoryBySlug } from "@/services/categoryService";

import { useLoading } from "@/context/loadingContext";
import routes from "@/config";
import NotFoundPage from "@/components/NotFoundPage";
import ProductSection from "../product/ProductSection";

export default function CategoryDetail() {
  const { setLoading } = useLoading();
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  const fetchCategoryData = async () => {
    setLoading(true);
    const categorySlug = slug.split(".html")[0];
    const data = await getCategoryBySlug(categorySlug);
    setCategory(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  if (!category) return <NotFoundPage />;

  return (
    <div className="container mx-auto py-10">
      <Link
        href={routes.categoriesMenu}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Quay lại
      </Link>
      <h1 className="text-3xl font-bold text-center mb-8">{category.name}</h1>
      <div className="text-lg text-center">{category.description}</div>
      <div className="w-[300px] h-[300px] m-auto relative">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover mx-auto rounded-lg shadow-lg mb-6"
          loading="lazy"
        />
      </div>
      <ProductSection category={category} />
    </div>
  );
}
