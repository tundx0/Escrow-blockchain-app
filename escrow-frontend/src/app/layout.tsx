import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/NavBar";
import { Web3Provider } from "@/contexts/Web3Context";
import { EscrowProvider } from "@/contexts/EscrowContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escrow Blockchain App",
  description: "Escrow App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <EscrowProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </EscrowProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
