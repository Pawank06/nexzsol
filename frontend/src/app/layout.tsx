import '@/app/globals.css'
import { Inter } from "next/font/google";

import { Metadata } from "next";
import ogImage from "../app/opengraph-image.png";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexzsol.tech/"),
  title: "nexzsol",
  description:
    "Contribute your expertise and earn Solana by solving real-world problems.",
  openGraph: {
    title: "https://www.nexzsol.tech/",
    description:
      "Turn your github contributions into solana rewards.",
    url: "https://www.nexzsol.tech/",
    siteName: "nexzsol.tech",
    images: [
      {
        url: "https://nexzsol.tech.opengraph-image.png",
        width: ogImage.width,
        height: ogImage.height,
      },
    ],

    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "nexzsol",
    card: "summary_large_image",

    images: [
      {
        url: "https://nexzsol.tech.opengraph-image.png",
        width: ogImage.width,
        height: ogImage.height,
      },
    ],
  },
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}




