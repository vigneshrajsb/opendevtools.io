import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CommandPaletteProvider } from "@/components/shared/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://opendevtools.io"),
  title: {
    default: "OpenDevTools - Free Online Developer Tools",
    template: "%s | OpenDevTools",
  },
  description:
    "Free, open-source developer tools. JSON, YAML, CSV converters, text diff, and more. All processing happens in your browser - no data sent to servers.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "YAML converter",
    "CSV converter",
    "online tools",
    "free tools",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OpenDevTools",
  },
  twitter: {
    card: "summary",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>{children}</CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
