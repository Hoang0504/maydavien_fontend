import type { Metadata } from "next";

import { getCategoryBySlug } from "@/services/categoryService";
import CategoryDetail from "@/components/category/CategoryDetail";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // fetch data
  const categorySlug = params.slug.split(".html")[0];
  const category = await getCategoryBySlug(categorySlug);

  return {
    title: category.data.name,
    description: category.data.description,
    openGraph: {
      title: category.data.name,
      description: category.data.description,
      type: "website",
      images: [category.data.image],
    },
  };
}

function Page() {
  return <CategoryDetail />;
}

export default Page;
