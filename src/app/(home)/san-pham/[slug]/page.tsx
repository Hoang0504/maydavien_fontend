import type { Metadata } from "next";

import { getProductBySlug } from "@/services/productService";
import ProductDetail from "@/components/product/ProductDetail";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const productSlug = params.slug.split(".html")[0];
  const product = await getProductBySlug(productSlug);

  return {
    title: product.data.name,
    description: product.data.description,
    openGraph: {
      title: product.data.name,
      description: product.data.description,
      type: "website",
      images: [product.data.image],
    },
  };
}

function Page() {
  return <ProductDetail />;
}

export default Page;
