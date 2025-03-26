"use client";

import Link from "next/link";
import Image from "next/image";
import classNames from "classnames/bind";

import { Category } from "@/models/Category";
import routes from "@/config";

import styles from "./CategoryCard.module.scss";

const cx = classNames.bind(styles);

export default function CategoryCard(category: Category) {
  return (
    <Link
      href={`${routes.categories}/${category.slug}.html`}
      className="flex flex-col items-center text-center space-y-4 hover:shadow-xl hover:scale-105 transition h-[332px]"
    >
      <h3 className="font-bold text-lg">{category.name}</h3>
      <div className={cx("card-image-wrapper", "relative")}>
        <Image
          src={category.image}
          alt={category?.slug ?? ""}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-gray-600 line-clamp-3">{category.description}</p>
    </Link>
  );
}
