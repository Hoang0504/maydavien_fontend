"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/models/Product";
import routes from "@/config";

interface ProductBoxProps {
  product: Product;
}

function ProductBox({ product }: ProductBoxProps) {
  return (
    <Link
      href={`${routes.products}/${product.slug}`}
      className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition hover:scale-105"
    >
      <div className="relative w-full h-[400px] md:h-64 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          loading="lazy"
        />
      </div>
      <h3 className="text-lg font-bold text-center mb-2">{product.name}</h3>
      <div className="text-center">
        {product.old_price && (
          <span className="text-gray-500 line-through mr-2">
            {product.old_price.toLocaleString()} đ
          </span>
        )}
        <span className="text-red-600 font-bold">
          {product.price.toLocaleString()} đ
        </span>
      </div>
    </Link>
  );
}

export default ProductBox;
