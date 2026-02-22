import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../styles/globals.css";
import "../styles/teams.css";

export const metadata: Metadata = {
  title: "Alexandru Fîntînariu",
  description: "Full-stack developer building reliable systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${GeistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}