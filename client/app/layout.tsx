import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "regenerOntology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.className}`}>
        <div className="min-h-screen flex flex-col lg:mx-20 mx-10 bg-white">
          <header className="py-4 px-24 flex">
            <h1 className="text-2xl">
              <Link href="/">regenerOntology</Link>
            </h1>
          </header>
          <main className=" flex-grow flex-col items-center justify-between p-24 flex-0 ">
            <ApolloWrapper>{children}</ApolloWrapper>
          </main>
          <footer className="p-6 bg-black">
            <nav className="text-white">
              <a href="https://github.com/smsms415/grc-assessment">
                source code
              </a>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
