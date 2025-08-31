import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globle.css";
import  {Theme} from "./Theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Resume"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  className="light" style={{colorScheme : "light"}} >
       <link rel="icon" type="image" href="/favicon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
