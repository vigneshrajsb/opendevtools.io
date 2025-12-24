import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder",
  description:
    "Encode or decode URL strings. Free online tool for URL encoding and decoding. No data sent to servers.",
  openGraph: {
    title: "URL Encoder/Decoder | OpenDevTools",
    description: "Encode or decode URL strings instantly in your browser.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
