import "../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import classNames from "classnames/bind";
import Script from "next/script";

import { Metadata } from "next";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Loading from "@/components/Loading";

import LoadingProvider from "@/context/loadingContext";

import styles from "../body.module.scss";

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
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.css"
          integrity="sha512-vRbASHFS0JiM4xwX/iqr9mrD/pXGnOP2CLdmXSSNAjLdgQVFyt4qI+BIoUW7/81uSuKRj0cWv3Dov8vVQOTHLw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <LoadingProvider>
          <Loading />
          <Header />
          <div className={cx("body-content")}>{children}</div>
          <Footer />
        </LoadingProvider>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.js"
          integrity="sha512-lZD0JiwhtP4UkFD1mc96NiTZ14L7MjyX5Khk8PMxJszXMLvu7kjq1sp4bb0tcL6MY+/4sIuiUxubOqoueHrW4w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></Script>
      </body>
    </html>
  );
}
