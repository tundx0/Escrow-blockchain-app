"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { Web3Provider } from "@/contexts/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
