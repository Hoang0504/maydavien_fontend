"use client";

import { Introduce } from "@/models/Introduce";
import { getImageResource } from "@/utils";
import Image from "next/image";

export default function IntroduceBox({
  introduce,
  index,
}: {
  introduce: Introduce;
  index: number;
}) {
  const bgColors = ["bg-teal-200", "bg-yellow-200"];
  const bgColor =
    introduce.type === 1 ? "" : index % 2 === 0 ? bgColors[1] : bgColors[0];
  const reverseOrder = index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <div className={`${index % 2 === 0 && "bg-gray-100"}`}>
      <section className={"container mx-auto"}>
        <div
          className={`flex flex-col items-center gap-6 p-6 rounded-lg ${
            introduce.type !== 1 && reverseOrder
          }`}
        >
          {/* Nội dung */}
          <div
            className={`w-full ${
              introduce.type !== 1 && "md:w-1/2 shadow-lg"
            } ${bgColor} p-6 rounded-lg text-center`}
          >
            <h2 className="text-xl font-bold mb-3">{introduce.title}</h2>
            <p className="text-gray-700 mb-4">{introduce.description}</p>
            {introduce.link_title && introduce.link_url && (
              <a
                href={introduce.link_url}
                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                {introduce.link_title}
              </a>
            )}
          </div>

          {/* Hình ảnh */}
          {/* <div
            className={` flex justify-center`}
          > */}
          <Image
            className={`${introduce.type === 1 ? "w-full" : "w-1/2"}`}
            src={getImageResource(introduce.image)}
            alt={introduce.title}
            width={500}
            height={300}
            unoptimized
          />
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
