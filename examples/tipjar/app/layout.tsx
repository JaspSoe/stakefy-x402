import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletProvider";
import { StakefyProvider } from "@/components/StakefyProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TipJar - Send tips with @username",
  description: "Tip creators using Solana and Stakefy x402",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <WalletContextProvider>
          <StakefyProvider>
            {children}
          </StakefyProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
