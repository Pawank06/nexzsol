import '@/app/globals.css'
import { Manrope } from "next/font/google";

import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

const manrop = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'nexzsol',
  description: 'Turn your github contributions into solana rewards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={manrop.className}>
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




