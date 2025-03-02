"use client";

import { useEffect, useState } from "react";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { getProducts } from "@/services/productService";
import ProductBox from "./ProductBox";

function ProductSection({
  id,
  category,
}: {
  id?: string;
  category?: Category;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    getProducts({ page, pageSize, categoryId: category?.id })
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.total_pages);
      })
      .catch(console.error);
  }, [page, category]);

  const nextPage = () =>
    setPage((prev) => (prev < totalPages! ? prev + 1 : prev));
  const prevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

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
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
          disabled={page === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages! }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-lg ${
                page === pageNumber
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default ProductSection;
