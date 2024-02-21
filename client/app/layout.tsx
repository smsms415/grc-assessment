import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import Head from "next/head";

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
            <h1 className="text-2xl">regenerOntology</h1>
          </header>
          <main className=" flex-grow flex-col items-center justify-between p-24 flex-0 ">
            <ApolloWrapper>{children}</ApolloWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
