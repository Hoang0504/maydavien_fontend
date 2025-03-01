"use client";

import Image from "next/image";
import classNames from "classnames/bind";
import { getImageResource } from "@/utils";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
}

const cx = classNames.bind(styles);

export default function CategoryCard({
  title,
  image,
  description,
}: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h3 className="font-bold text-lg">{title}</h3>
      <Image
        src={getImageResource(image)}
        alt={title}
        width={200}
        height={200}
        className={cx("card-image", {
          "object-contain": true,
        })}
      />
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
