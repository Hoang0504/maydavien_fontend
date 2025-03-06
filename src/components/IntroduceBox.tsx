"use client";

import Image from "next/image";

import { Introduce } from "@/models/Introduce";

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
              introduce.type !== 1 && "md:w-3/5 shadow-lg"
            } ${bgColor} p-6 rounded-lg text-center`}
          >
            <h2 className="text-xl font-bold mb-3">{introduce.title}</h2>
            <p className="text-gray-700 mb-4">{introduce.description}</p>
            {introduce.link_title && introduce.link_url && (
              <a
                href="tel:0914488248"
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
            className={`${introduce.type === 1 ? "w-full" : "md:w-2/5"}`}
            src={introduce.image}
            alt={introduce.title}
            width={500}
            height={300}
            loading="lazy"
          />
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
