import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globle.css";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies(); 
  const themeCookie = cookieStore.get("theme")?.value ?? "light";

  return (
    <html lang="en" className={themeCookie} style={{ colorScheme: themeCookie }}>
      <link rel="icon" type="image" href="/favicon.png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme={themeCookie} enableSystem={true}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
