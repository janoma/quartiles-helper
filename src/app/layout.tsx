import "@/src/index.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quartiles helper",
  description: "Get a little push when playing Quartiles",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        {children}
        <footer className="mx-auto mt-8 mb-8 max-w-sm text-center text-xs sm:mt-16">
          Created by <Link href="https://janoma.dev">janoma</Link>.{" "}
          <Link href="">Contribute</Link>.
        </footer>
      </body>
    </html>
  );
}
