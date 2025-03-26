"use client";

import { useCallback, useEffect, useState } from "react";

import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { getProducts } from "@/services/productService";
import { useLoading } from "@/context/loadingContext";
import ProductBox from "./ProductBox";
import PaginationBar from "../PaginationBar";

function ProductSection({
  id,
  category,
}: {
  id?: string;
  category?: Category;
}) {
  const { setLoading } = useLoading();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchProductsData = async () => {
    setLoading(true);
    const data = await getProducts({
      page: page.toString(),
      pageSize: pageSize.toString(),
      categoryId: category?.id?.toString() || "",
    });
    setProducts(data.data);
    setTotalPages(data.total_pages ? parseInt(data.total_pages.toString()) : 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsData();
  }, [page, pageSize, category?.id]);

  const setPageOfPagination = useCallback((page: number) => {
    setPage(page);
  }, []);

  return (
    <section id={id} className="container mx-auto py-10">
      <h2 className="text-center text-3xl font-bold mb-8">
        NHỮNG SẢN PHẨM{" "}
        {category ? " CỦA " + category.name.toUpperCase() : " NỔI BẬT"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductBox key={product.id} product={product} />
        ))}
      </div>
      <PaginationBar
        page={page}
        totalPages={totalPages}
        setPage={setPageOfPagination}
      />
    </section>
  );
}

export default ProductSection;
