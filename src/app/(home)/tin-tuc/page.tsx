import { Metadata } from "next";

import News from "@/components/news/News";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Cung cấp những thông tin hữu ích về máy làn đá viên.",
  openGraph: {
    title: "Tin tức",
    description: "Cung cấp những thông tin hữu ích về máy làn đá viên.",
    type: "website",
    images: [`/logo.jpg`],
  },
};

function Page() {
  return <News />;
}

export default Page;
