import "../globals.css";

import React from "react";
import { Metadata } from "next";

import SidebarProvider from "@/context/sidebarContext";
import AuthenticationProvider from "@/context/authenticationContext";

export const metadata: Metadata = {
  title: "Admin máy đá viên Nhật Anh",
  description: "Chuyên cung cấp máy làm đá viên chất lượng cao.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AuthenticationProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthenticationProvider>
      </body>
    </html>
  );
}
