import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { Metadata } from "next";

import Header from "@/components/layouts/Header";

export const metadata: Metadata = {
  title: "Máy đá viên Nhật Anh",
  description: "Chuyên cung cấp máy làm đá viên chất lượng cao.",
  icons: {
    icon: "./favicon.ico", // This maps to public/favicon.ico
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
