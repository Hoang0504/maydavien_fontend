import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import classNames from "classnames/bind";

import { Metadata } from "next";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

import styles from "./body.module.scss";

const cx = classNames.bind(styles);

export const metadata: Metadata = {
  title: "Máy đá viên Nhật Anh",
  description: "Chuyên cung cấp máy làm đá viên chất lượng cao.",
  icons: "/favicon.ico",
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
        <div className={cx("body-content")}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
