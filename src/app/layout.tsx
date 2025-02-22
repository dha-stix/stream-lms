import type { Metadata } from "next";
import { Rubik } from 'next/font/google'
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const inter = Rubik({ weight: ["300", "400", "500", "600", "700"], subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LinkedUp",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
