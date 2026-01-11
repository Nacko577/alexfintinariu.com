import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/teams.css';

export const metadata: Metadata = {
  title: 'fîntînariu alexandru',
  description: 'Personal portfolio website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
