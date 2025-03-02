"use client";

import Link from "next/link";
import Image from "next/image";
import classNames from "classnames/bind";

import { getImageResource } from "@/utils";
import { Category } from "@/models/Category";
import routes from "@/config";

import styles from "./CategoryCard.module.scss";

const cx = classNames.bind(styles);

export default function CategoryCard(category: Category) {
  return (
    <Link
      href={`${routes.categories}/${category.slug}`}
      className="flex flex-col items-center text-center space-y-4"
    >
      <h3 className="font-bold text-lg">{category.name}</h3>
      <Image
        src={getImageResource(category.image)}
        alt={category.slug}
        width={200}
        height={200}
        className={cx("card-image", "object-contain")}
        unoptimized
      />
      <p className="text-gray-600">{category.description}</p>
    </Link>
  );
}
