import type { Metadata } from "next";
import { Noto_Sans as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/constants";
import GlobalSession from "@/providers";
import Header from "@/components/shared/header";
import MaxWrapper from "@/components/shared/max-wrapper";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${site.name} ・ ${site.description}`,
  description: site.description,
  keywords: ["luma", "event", "web3"],
  authors: [
    {
      name: site.author,
      url: site.profile,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable
        )}>
        <GlobalSession>
          {" "}
          <div className="flex-1 flex flex-col">
            <Header />
            <MaxWrapper className="flex-1 flex flex-col">{children}</MaxWrapper>
          </div>
        </GlobalSession>
      </body>
    </html>
  );
}
